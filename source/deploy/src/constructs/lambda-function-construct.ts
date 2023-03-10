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

const lambda = cdk.aws_lambda_nodejs;

export interface LambdaFunctionConstructProps extends cdk.StackProps {
  readonly lambdaAsset: string;
  readonly lambdaEnvConfig?: { [key: string]: string };
}

const defaultProps: Partial<LambdaFunctionConstructProps> = {};

export class LambdaFunctionConstruct extends Construct {
  public function: cdk.aws_lambda_nodejs.NodejsFunction;

  constructor(
    parent: Construct,
    name: string,
    props: LambdaFunctionConstructProps
  ) {
    super(parent, name);

    props = { ...defaultProps, ...props };

    this.function = new lambda.NodejsFunction(this, name, {
      entry: props.lambdaAsset,
      handler: "handler",
      depsLockFilePath: "../api/package-lock.json",
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      architecture: cdk.aws_lambda.Architecture.X86_64,
      environment: props.lambdaEnvConfig,
      bundling: {
        externalModules: ["@aws-sdk/*"],
      },
    });
  }
}
