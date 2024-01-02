/**
 * Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 *
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *   http://aws.amazon.com/asl/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

import gitBranch from "git-branch";
import gitRepoName from "git-repo-name";
import * as fs from "fs";

interface PipelineStackProps extends cdk.StackProps {
  /**
   * The current branch
   */
  currentGitBranch: string;
  /**
   * The current git repo name
   */
  currentGitRepoName: string;
  /**
   * Name of the Application Stack to deploy
   */
  appStackName: string;
}

/**
 * Deploys a CICD stack using CodePipeline and CodeBuild.  The target stack names are determined by the current git branch.  A git repository is REQUIRED
 *
 * If the Application Stack fails to update due to incompatible changes in the deployment, just delete the stack in CloudFormation and redeploy with another commit.
 */
export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const pipeline = new cdk.aws_codepipeline.Pipeline(this, "pipeline", {
      pipelineName: `${stackName}`,
      restartExecutionOnUpdate: true,
      enableKeyRotation: true,
    });

    const sourceOutput = new cdk.aws_codepipeline.Artifact("SourceArtifact");
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new cdk.aws_codepipeline_actions.CodeCommitSourceAction({
          actionName: "Source",
          repository: cdk.aws_codecommit.Repository.fromRepositoryName(
            this,
            "repo",
            props.currentGitRepoName
          ),
          branch: props.currentGitBranch,
          trigger: cdk.aws_codepipeline_actions.CodeCommitTrigger.EVENTS,
          output: sourceOutput,
        }),
      ],
    });

    pipeline.addStage({
      stageName: "BuildAndDeploy",
      actions: [
        new cdk.aws_codepipeline_actions.CodeBuildAction({
          actionName: "BuildAndDeploy",
          input: sourceOutput,
          project: new cdk.aws_codebuild.Project(this, "build", {
            buildSpec: cdk.aws_codebuild.BuildSpec.fromObject({
              version: "0.2",
              phases: {
                build: {
                  commands: ["npm run build && npm run deploy"],
                },
              },
            }),
            environment: {
              buildImage: cdk.aws_codebuild.LinuxBuildImage.STANDARD_5_0,
              privileged: true,
              computeType: cdk.aws_codebuild.ComputeType.MEDIUM, // Change this if the build fails due to out of memory errors
            },
            role: new cdk.aws_iam.Role(this, "role", {
              managedPolicies: [
                cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                  "PowerUserAccess"
                ),
                cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
                  "IAMFullAccess"
                ),
              ],
              assumedBy: new cdk.aws_iam.ServicePrincipal(
                "codebuild.amazonaws.com"
              ),
            }),
          }),
          environmentVariables: {
            STACK_NAME: {
              value: props.appStackName, // This is the name of the AppStack. Don't use the stackName as that's the name of the CICD stack name
              type: cdk.aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            },
          },
          type: cdk.aws_codepipeline_actions.CodeBuildActionType.BUILD,
        }),
      ],
    });
  }
}

const app = new cdk.App();

const context = getGitContext();
const stackName = `${context.appStackName}-cicd`; // append cicd to the app stack
const account =
  app.node.tryGetContext("account") ||
  process.env.CDK_DEPLOY_ACCOUNT ||
  process.env.CDK_DEFAULT_ACCOUNT;
const region =
  app.node.tryGetContext("region") ||
  process.env.CDK_DEPLOY_REGION ||
  process.env.CDK_DEFAULT_REGION;

// Deploy Pipeline Stack
/* eslint-disable @typescript-eslint/no-unused-vars */
const appStack = new PipelineStack(app, stackName, {
  env: {
    account: account,
    region: region,
  },
  stackName: stackName,
  currentGitBranch: context.currentGitBranch,
  currentGitRepoName: context.currentGitRepoName,
  appStackName: context.appStackName,
});

app.synth();

/**
 * Gets branch name and repository name from git configuration.  Returns branch name, repo name and app stack name
 */
function getGitContext() {
  const findDirUp = (directoryName: string): string => {
    let cwd = process.cwd();
    // while not the file system root (linux & windows)
    while (!(cwd === "/" || cwd === "C:\\")) {
      const directories = fs.readdirSync(cwd);
      if (directories.filter((dir) => dir === directoryName).length > 0) {
        return cwd;
      } else {
        cwd = path.join(cwd, "../");
      }
    }
    throw new Error(
      `Directory ${directoryName} could not be found in a parent directory of ${process.cwd()}.  Git project is required for CICD deployment`
    );
  };

  const gitDirectory = findDirUp(".git");
  const currentGitBranch = gitBranch.sync(gitDirectory);
  const currentGitRepoName = gitRepoName.sync(gitDirectory);
  // replaces special characters with - and truncates to 122 characters.  128 is the max for CloudFormation.
  // This name is used below for the CICD stack name which appends an additional 5 characters.
  const appStackName = currentGitBranch
    .replace(/[^\w\s]/gi, "-")
    .substring(0, 122);

  return {
    currentGitBranch,
    currentGitRepoName,
    appStackName,
  };
}
