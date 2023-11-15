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

const s3 = cdk.aws_s3;

export interface S3LibraryConstructProps extends cdk.StackProps {
  /**
   * The Arn of the WafV2 WebAcl.
   */
  readonly webAclArn?: string;
}

const defaultProps: Partial<S3LibraryConstructProps> = {};

/**
 * Deploys a CloudFront Distribution pointing to an S3 bucket containing the deployed web application {webSiteBuildPath}.
 * Creates:
 * - S3 bucket
 * - CloudFrontDistribution
 * - OriginAccessIdentity
 *
 * On redeployment, will automatically invalidate the CloudFront distribution cache
 */
export class S3LibraryConstruct extends Construct {
  /**
   * The origin access identity used to access the S3 website
   */
  public originAccessIdentity: cdk.aws_cloudfront.OriginAccessIdentity;

  /**
   * The cloud front distribution to attach additional behaviors like `/api`
   */
  public s3bucket: cdk.aws_s3.Bucket;

  constructor(parent: Construct, name: string, props: S3LibraryConstructProps) {
    super(parent, name);

    props = { ...defaultProps, ...props };

    // get the parent stack reference for the stackName and the aws region
    const stack = cdk.Stack.of(this);

    // When using Distribution, do not set the s3 bucket website documents
    // if these are set then the distribution origin is configured for HTTP communication with the
    // s3 bucket and won't configure the cloudformation correctly.
    const libraryBucket = new s3.Bucket(this, "PipelineBucket", {
      encryption: s3.BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      eventBridgeEnabled: true,
    });

    libraryBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        sid: "EnforceTLS",
        effect: cdk.aws_iam.Effect.DENY,
        principals: [new cdk.aws_iam.AnyPrincipal()],
        actions: ["s3:*"],
        resources: [libraryBucket.bucketArn, libraryBucket.bucketArn + "/*"],
        conditions: { Bool: { "aws:SecureTransport": "false" } },
      })
    );

    const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    libraryBucket.grantRead(originAccessIdentity);

    libraryBucket.addCorsRule({
      allowedMethods: [
        s3.HttpMethods.GET,
        s3.HttpMethods.PUT,
        s3.HttpMethods.POST,
        s3.HttpMethods.DELETE,
      ],
      allowedOrigins: ["*"],
      allowedHeaders: ["*"],
    });

    // export any cf outputs
    new cdk.CfnOutput(this, "LibraryBucket", {
      value: libraryBucket.bucketName,
    });

    // assign public properties
    this.originAccessIdentity = originAccessIdentity;
    this.s3bucket = libraryBucket;
  }
}
