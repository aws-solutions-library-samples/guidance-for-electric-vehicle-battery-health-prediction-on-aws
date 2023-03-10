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

import { CfWafStack } from "./cf-waf-stack";
import { AppStack } from "./app-stack";
import { MLOpsStack } from "./ml-ops-stack";
import { AwsSolutionsChecks } from "cdk-nag";
import { suppressCdkNagRules } from "./cdk-nag-suppressions";

// Custom config providers.
import { getConfigProvider } from "./config/index";
const gitContext = getConfigProvider("git")();

process.env.CDK_DEBUG = "true";
const app = new cdk.App();

const stackName =
  app.node.tryGetContext("stack_name") || gitContext.appStackName;
const account =
  app.node.tryGetContext("account") ||
  process.env.CDK_DEPLOY_ACCOUNT ||
  process.env.CDK_DEFAULT_ACCOUNT;
const region =
  app.node.tryGetContext("region") ||
  process.env.CDK_DEPLOY_REGION ||
  process.env.CDK_DEFAULT_REGION;

const lambdaFnPath = "../api/lib";

// Deploy Waf for CloudFront in us-east-1
const cfWafStackName = stackName + "-waf";

const cfWafStack = new CfWafStack(app, cfWafStackName, {
  env: {
    account: account,
    region: "us-east-1",
  },
  description: "Guidance for Electric Vehicle (EV) Battery Health Prediction (SO9184)",
  stackName: cfWafStackName,
});

// Deploy App Stack
const appStack = new AppStack(app, stackName, {
  env: {
    account: account,
    region: region,
  },
  description: "Guidance for Electric Vehicle (EV) Battery Health Prediction (SO9184)",
  stackName: stackName,
  ssmWafArnParameterName: cfWafStack.ssmWafArnParameterName,
  ssmWafArnParameterRegion: cfWafStack.region,
  lambdaFnPath: lambdaFnPath,
});

appStack.addDependency(cfWafStack);

// Deploy ML pipeline stack
const mlStack = new MLOpsStack(app, stackName + "-ml", {
  env: {
    account: account,
    region: region,
  },
  description: "Guidance for Electric Vehicle (EV) Battery Health Prediction (SO9184)",
  libraryBucket: appStack.bucket,
  lambdaFnPath: lambdaFnPath,
  pipelineTable: appStack.pipelineTable,
  appSyncApi: appStack.appSyncApi,
});

mlStack.addDependency(appStack);

// Add Aws Solutions Checks and suppress rules
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ logIgnores: true }));
suppressCdkNagRules(cfWafStack);
suppressCdkNagRules(mlStack);
suppressCdkNagRules(appStack);

app.synth();
