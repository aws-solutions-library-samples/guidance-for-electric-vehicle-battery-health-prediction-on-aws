/**
 * Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 *
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/asl/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import * as cdk from "aws-cdk-lib";
import { NagSuppressions } from "cdk-nag";

/**
 * General cdk nag suppressions to allow infrastructure that is acceptable for a prototype
 */
export const suppressCdkNagRules = (stack: cdk.Stack) => {
  // General
  NagSuppressions.addStackSuppressions(
    stack,
    [
      {
        id: "AwsSolutions-APIG1",
        reason: "API Gateway access logging not required for prototype",
      },
      {
        id: "AwsSolutions-CFR1",
        reason: "CloudFront geo restrictions not required for prototype",
      },
      {
        id: "AwsSolutions-CFR3",
        reason: "CloudFront access logging not required for prototype",
      },
      {
        id: "AwsSolutions-CFR4",
        reason:
          "Custom certificate required for enabling this rule.  Not required for prototype",
      },
      {
        id: "AwsSolutions-COG2",
        reason: "Cognito MFA not required for prototype",
      },
      {
        id: "AwsSolutions-COG3",
        reason: "Cognito advanced security mode not required for prototype",
      },
      {
        id: "AwsSolutions-IAM4",
        reason: "AWS managed policies allowed for prototype",
      },
      { id: "AwsSolutions-IAM5", reason: "IAM wildcard allowed" },
      {
        id: "AwsSolutions-L1",
        reason: "Latest runtime not required for prototype",
      },
      {
        id: "AwsSolutions-S1",
        reason: "S3 server access logs not required for prototype",
      },
      {
        id: "AwsSolutions-SNS2",
        reason: "Temporary SNS setup for experimentation. Unsupress.",
      },
      {
        id: "AwsSolutions-SNS3",
        reason: "Temporary SNS setup for experimentation. Unsupress.",
      },
    ],
    true
  );
};
