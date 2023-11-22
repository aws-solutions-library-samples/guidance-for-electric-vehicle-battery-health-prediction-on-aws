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
import { LambdaFunctionConstruct } from "./lambda-function-construct";

const events = cdk.aws_events;
const targets = cdk.aws_events_targets;

export interface EventBridgeLambdaProps extends cdk.StackProps {
  readonly pipelineStatus: string;
  readonly pipelineBucket: cdk.aws_s3.Bucket;
  readonly appSyncApi: cdk.aws_appsync.GraphqlApi;
  readonly triggerType: string;
  readonly triggerFilter?: string;
  readonly serviceRole?: cdk.aws_iam.Role;
  readonly lambdaFnPath: string;
  readonly lambdaAsset: string;
  readonly lambdaPolicy?: cdk.aws_iam.PolicyStatement;
  readonly lambdaEnvConfig?: { [key: string]: string };
}

const defaultProps: Partial<EventBridgeLambdaProps> = {};

export class EventBridgeLambdaConstruct extends Construct {
  constructor(parent: Construct, name: string, props: EventBridgeLambdaProps) {
    super(parent, name);

    props = { ...defaultProps, ...props };

    const lambdaFn = new LambdaFunctionConstruct(this, "Fn", {
      lambdaAsset: `${props.lambdaFnPath}/${props.lambdaAsset}`,
      lambdaEnvConfig: {
        ...props.lambdaEnvConfig,
        PIPELINE_STATUS: props.pipelineStatus,
        APPSYNC_GRAPHQL_URL: props.appSyncApi.graphqlUrl,
        SERVICE_ROLE_ARN: props.serviceRole?.roleArn!,
      },
    }).function;

    if (props.lambdaPolicy) lambdaFn.addToRolePolicy(props.lambdaPolicy);

    // Fill out trigger information based on trigger info
    let triggerSrc,
      triggerFilter = null;
    if (props.triggerType.match(/glue/i)) {
      triggerSrc = "glue";
      triggerFilter = {
        jobName: [props.triggerFilter],
        state: ["SUCCEEDED", "FAILED", "TIMEOUT", "STOPPED"],
      };
    } else if (props.triggerType.match(/forecast/i)) {
      triggerSrc = "forecast";
      triggerFilter = {
        status: ["ACTIVE", "CREATE_FAILED", "CREATE_STOPPED"],
      };
    } else {
      triggerSrc = "s3";
      triggerFilter = {
        bucket: { name: [props.pipelineBucket.bucketName] },
        object: { key: [{ suffix: props.triggerFilter }] },
      };
    }

    const eventTrigger = new events.Rule(this, "Trigger", {
      eventPattern: {
        source: [`aws.${triggerSrc}`],
        detailType: [props.triggerType],
        detail: triggerFilter,
      },
    });

    // Allow lambda to pass role to Forecast import
    props.serviceRole?.grantPassRole(lambdaFn.grantPrincipal);

    props.appSyncApi.grantQuery(lambdaFn);
    props.appSyncApi.grantMutation(lambdaFn);

    eventTrigger.addTarget(new targets.LambdaFunction(lambdaFn));
  }
}
