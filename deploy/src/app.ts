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
import { BaseStack } from "./base-stack";
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
const s3AssetsPath = "cdk-assets";

const cfWafStack = new CfWafStack(app, stackName + "-waf", {
  env: {
    account: account,
    region: "us-east-1",
  },
  // stackName: stackName + "-waf",
});

// Deploy base stack with lambda, S3 and ddb resources
const baseStack = new BaseStack(app, stackName, {
  env: {
    account: account,
    region: region,
  },
  // stackName: stackName + "-base",
  ssmWafArnParameterName: cfWafStack.ssmWafArnParameterName,
  ssmWafArnParameterRegion: cfWafStack.region,
  lambdaFnPath: lambdaFnPath,
  s3AssetsPath: s3AssetsPath,
});

baseStack.addDependency(cfWafStack);

// Deploy ML pipeline stack with event-bridge, glue and forecast
const mlStack = new MLOpsStack(app, stackName + "-ml", {
  env: {
    account: account,
    region: region,
  },
  lambdaFnPath: lambdaFnPath,
  s3AssetsPath: s3AssetsPath,
  pipelineBucket: baseStack.bucket,
  cdkBucket: baseStack.cdkBucket,
  pipelineTable: baseStack.pipelineTable,
  appSyncApi: baseStack.appSyncApi,
  restApi: baseStack.restApi,
  retrainFn: baseStack.retrainFn,
});

mlStack.addDependency(baseStack);

// TODO: Deploy API stack with REST and AppSync resources
// const apiStack = ...

// Add Aws Solutions Checks and suppress rules
cdk.Aspects.of(app).add(new AwsSolutionsChecks({ logIgnores: true }));
suppressCdkNagRules(cfWafStack);
suppressCdkNagRules(baseStack);
suppressCdkNagRules(mlStack);

app.synth();
