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
import { RemovalPolicy } from "aws-cdk-lib";
import { StreamViewType } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

const ddb = cdk.aws_dynamodb;

export interface DdbTableConstructProps extends cdk.StackProps {}

const defaultProps: Partial<DdbTableConstructProps> = {};

export class DdbTableConstruct extends Construct {
  public table: cdk.aws_dynamodb.Table;

  constructor(parent: Construct, name: string, props: DdbTableConstructProps) {
    super(parent, name);

    props = { ...defaultProps, ...props };

    // get the parent stack reference for the stackName and the aws region
    const stack = cdk.Stack.of(this);

    this.table = new ddb.Table(this, name, {
      partitionKey: { name: "Id", type: ddb.AttributeType.STRING },
      tableClass: ddb.TableClass.STANDARD,
      encryption: ddb.TableEncryption.AWS_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      pointInTimeRecovery: true,
    });
  }
}
