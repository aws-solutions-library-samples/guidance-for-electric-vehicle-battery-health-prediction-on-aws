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
import { AmplifyConfigLambdaConstruct } from "./constructs/amplify-config-lambda-construct";
import { ApiGatewayV2CloudFrontConstruct } from "./constructs/apigatewayv2-cloudfront-construct";
import { CloudFrontS3WebSiteConstruct } from "./constructs/cloudfront-s3-website-construct";
import { CognitoWebNativeConstruct } from "./constructs/cognito-web-native-construct";
import { SsmParameterReaderConstruct } from "./constructs/ssm-parameter-reader-construct";
import { LambdaAppSyncConstruct } from "./constructs/lambda-appsync-construct";
import { S3LibraryConstruct } from "./constructs/s3-library-construct";
import { ApiGatewayV2LambdaConstruct } from "./constructs/apigatewayv2-lambda-construct";
import { DdbTableConstruct } from "./constructs/ddb-table-construct";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";
import { LambdaFunctionConstruct } from "./constructs/lambda-function-construct";
import { MapConstruct } from "./constructs/map-construct";
import { CDKDataDumpS3Construct } from "./constructs/cdk-assets-s3-construct";

export interface BaseStackProps extends cdk.StackProps {
  readonly ssmWafArnParameterName: string;
  readonly ssmWafArnParameterRegion: string;
  readonly lambdaFnPath: string;
  readonly s3AssetsPath: string;
}

/**
 * BaseStack for an S3 website and api gatewayv2 proxied through a CloudFront distribution
 *
 * copy this file and its dependencies into your project, then change the name of this file to a better name.
 * The only thing that needs to be configured is the webAppBuildPath
 *
 * see s3-website-cloudfront-apigatewayv2-appstack.png for architecture diagram
 */
export class BaseStack extends cdk.Stack {
  public bucket: cdk.aws_s3.Bucket;
  public cdkBucket: cdk.aws_s3.Bucket;
  public pipelineTable: cdk.aws_dynamodb.Table;
  public appSyncApi: cdk.aws_appsync.GraphqlApi;
  public restApi: apigw.HttpApi;
  public retrainFn: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    const webAppBuildPath = "../web-app/build";
    const map = new MapConstruct(this, "BatteryMap", {});

    const cognito = new CognitoWebNativeConstruct(this, "Cognito", {
      ...props,
      mapArn: map.cfnMap.attrMapArn,
    });

    const cfWafWebAcl = new SsmParameterReaderConstruct(
      this,
      "SsmWafParameter",
      {
        ssmParameterName: props.ssmWafArnParameterName,
        ssmParameterRegion: props.ssmWafArnParameterRegion,
      }
    ).getValue();

    /**
     * Create S3 buckets for website, library and iot data
     */
    const website = new CloudFrontS3WebSiteConstruct(this, "WebApp", {
      webSiteBuildPath: webAppBuildPath,
      webAclArn: cfWafWebAcl,
    });

    const library = new S3LibraryConstruct(this, "PipelineBucket", {
      webAclArn: cfWafWebAcl,
    });

    const cdkBucket = new CDKDataDumpS3Construct(this, "CDKBucket", {});
    /**
     * Create Pipeline DynamoDb database
     */
    const pipelineDdb = new DdbTableConstruct(this, "PipelineDdb", {
      hash_key_column: "Id",
    });

    const batteryDdb = new DdbTableConstruct(this, "batteryDdb", {
      hash_key_column: "battery",
    });

    /**
     * Create lambda function for location data
     */
    const locationDataFn = new LambdaFunctionConstruct(this, "LocationDataFn", {
      lambdaAsset: `${props.lambdaFnPath}/locationDataFn.ts`,
      lambdaEnvConfig: {
        BUCKET: cdkBucket.s3bucket.bucketName,
        KEY: `${props.s3AssetsPath}/battery-locations.csv`,
      },
    });

    /**
     * Create appSync api for querying, mutating and subscribing pipeline data
     */
    const appSync = new LambdaAppSyncConstruct(this, "LambdaAppSync", {
      appClientId: cognito.webClientId,
      identityPoolId: cognito.identityPoolId,
      userPool: cognito.userPool,
      pipelineDdb: pipelineDdb.table,
      batteryDdb: batteryDdb.table,
      locationDataFn: locationDataFn.function,
    });
    this.appSyncApi = appSync.appSyncApi;

    /**
     * Create lambda function with env variables for metadata
     */
    const chargingDataFn = new LambdaFunctionConstruct(this, "ChargingDataFn", {
      lambdaAsset: `${props.lambdaFnPath}/metadataLambdaFn.ts`,
      lambdaEnvConfig: {
        GRAPHQL_API_ENDPOINT: appSync.appSyncApi.graphqlUrl,
        MAP_NAME: map.cfnMap.mapName as string,
        PIPELINE_TABLE: pipelineDdb.table.tableName,
        BUCKET: library.s3bucket.bucketName,
        CDK_BUCKET: cdkBucket.s3bucket.bucketName,
        KEY: `${props.s3AssetsPath}/connected-batteries.json`,
      },
    });

    /**
     * -------- RETRAIN STEP --------
     * Event: `DataCheckpoint` value changed in Ddb
     * Action: Trigger pipeline starting from Step 2; pass checkpoint to spit parameter
     */
    const retrainFn = new LambdaFunctionConstruct(this, "RetrainPipeline", {
      lambdaAsset: `${props.lambdaFnPath}/retrainPipelineFn.ts`,
      lambdaEnvConfig: {
        PIPELINE_STATUS: "PROCESSING_DATASET",
        APPSYNC_GRAPHQL_URL: appSync.appSyncApi.graphqlUrl,
      },
    });

    /**
     * Grant Permissions
     */
    appSync.appSyncApi.grantMutation(chargingDataFn.function);
    appSync.appSyncApi.grantMutation(locationDataFn.function);
    appSync.appSyncApi.grantMutation(retrainFn.function);
    library.s3bucket.grantReadWrite(chargingDataFn.function);
    library.s3bucket.grantReadWrite(locationDataFn.function);
    pipelineDdb.table.grantReadWriteData(chargingDataFn.function);
    pipelineDdb.table.grantReadWriteData(retrainFn.function);
    cdkBucket.s3bucket.grantRead(chargingDataFn.function);
    cdkBucket.s3bucket.grantReadWrite(locationDataFn.function);

    /**
     * Create Rest API
     * ** Create Rest API Resource for getting SignedUrl
     * ** Create Rest API Resource for getting battery metadata
     */
    this.restApi = new ApiGatewayV2CloudFrontConstruct(this, "Api", {
      cloudFrontDistribution: website.cloudFrontDistribution,
      userPool: cognito.userPool,
      userPoolClient: cognito.webClientUserPool,
    }).apiGatewayV2;

    new ApiGatewayV2LambdaConstruct(this, "LambdaS3AccessApiGateway", {
      lambdaFn: chargingDataFn.function,
      routePath: "/api/link",
      methods: [apigw.HttpMethod.GET],
      api: this.restApi,
    });

    new ApiGatewayV2LambdaConstruct(this, "LambdaMetadataApiGateway", {
      lambdaFn: chargingDataFn.function,
      routePath: "/api/metadata",
      methods: [apigw.HttpMethod.GET],
      api: this.restApi,
    });

    new ApiGatewayV2LambdaConstruct(this, "RetrainPipelineApiGateway", {
      lambdaFn: retrainFn.function,
      routePath: "/api/retrain",
      methods: [apigw.HttpMethod.GET],
      api: this.restApi,
    });

    /**
     * Create Lambda to provide amplify config
     */
    new AmplifyConfigLambdaConstruct(this, "AmplifyConfigFn", {
      api: this.restApi,
      appClientId: cognito.webClientId,
      identityPoolId: cognito.identityPoolId,
      userPoolId: cognito.userPoolId,
      libraryBucketName: library.s3bucket.bucketName,
      graphqlEndpoint: appSync.appSyncApi.graphqlUrl,
      map: map.cfnMap.mapName,
      bucketUrl: cdkBucket.s3bucket.s3UrlForObject(),
    });

    /**
     * Assign to instance variables
     */
    this.bucket = library.s3bucket;
    this.cdkBucket = cdkBucket.s3bucket;
    this.pipelineTable = pipelineDdb.table;
    this.retrainFn = retrainFn.function;
  }
}
