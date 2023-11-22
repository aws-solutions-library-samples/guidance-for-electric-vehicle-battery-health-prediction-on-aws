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
import { EventBridgeLambdaConstruct } from "./constructs/eventbridge-lambda-contruct";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";

const iam = cdk.aws_iam;

export interface MLOpsStackProps extends cdk.StackProps {
  readonly lambdaFnPath: string;
  readonly s3AssetsPath: string;
  readonly pipelineBucket: cdk.aws_s3.Bucket;
  readonly cdkBucket: cdk.aws_s3.Bucket;
  readonly pipelineTable: cdk.aws_dynamodb.Table;
  readonly appSyncApi: cdk.aws_appsync.GraphqlApi;
  readonly restApi: apigw.HttpApi;
  readonly retrainFn: cdk.aws_lambda.Function;
}

/**
 * AppStack for an S3 website and api gatewayv2 proxied through a CloudFront distribution
 *
 * copy this file and its dependencies into your project, then change the name of this file to a better name.
 * The only thing that needs to be configured is the webAppBuildPath
 *
 * see s3-website-cloudfront-apigatewayv2-appstack.png for architecture diagram
 */
export class MLOpsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MLOpsStackProps) {
    super(scope, id, props);

    // NOTE: Create new S3 folder with UUID for every run
    // s3://<bucket>/data/123456/raw_dataset.csv

    const processingPluginKey = "processing_plugin.py";
    const rawDatasetKey = "raw_dataset.csv";
    const trainDatasetKey = "train_dataset.csv";
    const testDatasetKey = "test_dataset.csv";
    const testIdsKey = "test_ids.csv";
    const forecastPrefix = "tmp/predictions";
    const postProcessorKey = "post_processor.py";
    const postProcessorName = "PostProcessingJob";
    const defaultCheckpoint = 800;

    const glueRole = new iam.Role(this, "glueRole", {
      assumedBy: new iam.ServicePrincipal("glue.amazonaws.com"),
    });

    // Allow glue job to fetch plugin script from S3
    props.pipelineBucket.grantReadWrite(glueRole);
    props.cdkBucket.grantRead(glueRole);

    const forecastRole = new iam.Role(this, "forecastRole", {
      assumedBy: new iam.ServicePrincipal("forecast.amazonaws.com"),
    });

    // Allow forecast import job access to access dataset on S3
    props.pipelineBucket.grantReadWrite(forecastRole);
    props.cdkBucket.grantRead(forecastRole);

    // Permissions to create and run Glue jobs
    const glueAuthPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["glue:*"],
      resources: [
        `arn:aws:glue:${props.env?.region}:${props.env?.account}:job/*`,
      ],
    });

    // Permissions to execute Forecast functions
    const forecastAuthPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["forecast:*"],
      resources: ["*"],
    });

    // Upload static dataset and processor assets
    new cdk.aws_s3_deployment.BucketDeployment(this, "UploadDataAssets", {
      sources: [cdk.aws_s3_deployment.Source.asset(props.s3AssetsPath)],
      destinationBucket: props.cdkBucket,
      destinationKeyPrefix: props.s3AssetsPath,
    });

    // -------- STEP 1 --------
    // Event: CSV dataset uploaded to S3
    // Action: Pipeline created in Dynamodb
    const step1 = new EventBridgeLambdaConstruct(this, "InitPipeline", {
      ...props,
      pipelineStatus: "UPLOADING_DATASET",
      triggerType: "Object Created",
      triggerFilter: processingPluginKey,
      lambdaAsset: "initPipelineFn.ts",
    });

    // -------- STEP 2 --------
    // Event: Processing plugin uploaded to S3
    // Action: Kick-off processing job with Glue
    const step2 = new EventBridgeLambdaConstruct(this, "ProcessData", {
      ...props,
      pipelineStatus: "PROCESSING_DATASET",
      triggerType: "Object Created",
      triggerFilter: rawDatasetKey,
      serviceRole: glueRole,
      lambdaAsset: "processDataFn.ts",
      lambdaPolicy: glueAuthPolicy,
      lambdaEnvConfig: {
        PLUGIN_SCRIPT_KEY: processingPluginKey,
        DATA_CHECKPOINT: `${defaultCheckpoint}`,
      },
    });

    // -------- STEP 3 --------
    // Event: Training dataset uploaded to S3
    // Action: Import training dataset into Forecast
    const step3 = new EventBridgeLambdaConstruct(this, "ImportDataset", {
      ...props,
      pipelineStatus: "IMPORTING_DATASET",
      triggerType: "Object Created",
      triggerFilter: trainDatasetKey,
      serviceRole: forecastRole,
      lambdaAsset: "importDataFn.ts",
      lambdaPolicy: forecastAuthPolicy,
      lambdaEnvConfig: {
        DATASET_FREQUENCY: "D",
      },
    });

    // -------- STEP 4 --------
    // Event: Training data imported into Forecast
    // Action: Kick-off predictor training in Forecast
    const step4 = new EventBridgeLambdaConstruct(this, "TrainModel", {
      ...props,
      pipelineStatus: "TRAINING_PREDICTOR",
      triggerType: "Forecast Dataset Import Job State Change",
      lambdaAsset: "trainModelFn.ts",
      lambdaPolicy: forecastAuthPolicy,
      lambdaEnvConfig: {
        DATASET_FREQUENCY: "D",
        FORECAST_HORIZON: "30",
      },
    });

    // -------- STEP 5 --------
    // Event: Timeseries predictor finished training
    // Action: Generate forecasts for test cells
    const step5 = new EventBridgeLambdaConstruct(this, "GenForecast", {
      ...props,
      pipelineStatus: "GENERATING_FORECAST",
      triggerType: "Forecast Predictor Creation State Change",
      serviceRole: forecastRole,
      lambdaAsset: "genForecastFn.ts",
      lambdaPolicy: forecastAuthPolicy,
      lambdaEnvConfig: {
        TEST_IDS_KEY: testIdsKey,
      },
    });

    // -------- STEP 6 --------
    // Event: Forecast generation completed
    // Action: Export predictions for test cells to S3
    const step6 = new EventBridgeLambdaConstruct(this, "ExportPreds", {
      ...props,
      pipelineStatus: "EXPORTING_PREDICTIONS",
      triggerType: "Forecast Forecast Creation State Change",
      serviceRole: forecastRole,
      lambdaAsset: "exportPredsFn.ts",
      lambdaPolicy: forecastAuthPolicy,
      lambdaEnvConfig: {
        FORECAST_OUTPUT_PREFIX: forecastPrefix,
      },
    });

    // -------- STEP 7 --------
    // Event: Forecast predictions exported
    // Action: Partition exports in format expected by UI

    // This glue job is run with the pipeline ID for post-processing forecasts
    const postProcessor = new cdk.aws_glue.CfnJob(this, postProcessorName, {
      name: postProcessorName,
      role: glueRole.roleArn,
      command: {
        name: "glueetl",
        pythonVersion: "3",
        scriptLocation: `s3://${props.cdkBucket.bucketName}/${props.s3AssetsPath}/${postProcessorKey}`,
      },
      glueVersion: "3.0",
    });

    const step7 = new EventBridgeLambdaConstruct(this, "CleanExports", {
      ...props,
      pipelineStatus: "CLEANING_EXPORTS",
      triggerType: "Forecast Forecast Export Job State Change",
      lambdaAsset: "cleanExportsFn.ts",
      lambdaPolicy: glueAuthPolicy,
      lambdaEnvConfig: {
        GLUE_JOB_NAME: postProcessor.name!,
        DATA_BUCKET: props.pipelineBucket.bucketName,
        FORECAST_OUTPUT_PREFIX: forecastPrefix,
      },
    });

    // -------- FINAL STEP --------
    // Event: Predictions uploaded to S3
    // Action: Pipeline closed in Dynamodb

    new EventBridgeLambdaConstruct(this, "ClosePipeline", {
      ...props,
      pipelineStatus: "PIPELINE_FINISHED",
      triggerType: "Glue Job State Change",
      triggerFilter: postProcessor.name,
      lambdaAsset: "closePipelineFn.ts",
      lambdaPolicy: glueAuthPolicy,
      lambdaEnvConfig: {
        POST_PROCESSOR_NAME: postProcessorName,
      },
    });

    // all connected via event-bridge; ending one triggers the next one; all as a separate lambda function
    // Note: for forecasting beyond horizon, need to train new horizon. maybe with the latest data.
    // So make sure new data is logged in some meaningful csv way. This would be part of the retraining.
    // Retraining happens for two reasons: (1) forecast horizon expired, or (2) drift exceeds tolerance

    props.retrainFn.addToRolePolicy(glueAuthPolicy);
  }
}
