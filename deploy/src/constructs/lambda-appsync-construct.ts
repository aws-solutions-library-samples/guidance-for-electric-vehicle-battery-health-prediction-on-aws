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
import * as appsync from "aws-cdk-lib/aws-appsync";
import path from "path";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IFunction } from "aws-cdk-lib/aws-lambda";

export interface LambdaAppSyncConstructProps extends cdk.StackProps {
  /**
   * The Cognito UserPoolId to authenticate users in the front-end
   */
  readonly userPool: IUserPool;

  /**
   * The Cognito AppClientId to authenticate users in the front-end
   */
  readonly appClientId: string;

  /**
   * The Cognito IdentityPoolId to authenticate users in the front-end
   */
  readonly identityPoolId: string;

  /**
   * The simulation table for the resolver
   */
  readonly pipelineDdb: ITable;

  /**
   * The location data lambda resolver
   */
  readonly locationDataFn: cdk.aws_lambda.Function;
}

const defaultProps: Partial<LambdaAppSyncConstructProps> = {};

/**
 * Deploys a lambda to the api gateway under the path `/api/amplify-config`.
 * The route is unauthenticated.  Use this with `apigatewayv2-cloudfront` for a CORS free
 * amplify configuration setup
 */
export class LambdaAppSyncConstruct extends Construct {
  appSyncApi: appsync.GraphqlApi;

  constructor(
    parent: Construct,
    name: string,
    props: LambdaAppSyncConstructProps
  ) {
    super(parent, name);

    props = { ...defaultProps, ...props };

    // get the parent stack reference for the stackName and the aws region
    const stack = cdk.Stack.of(this);

    const api: appsync.GraphqlApi = new appsync.GraphqlApi(this, "AppSyncApi", {
      name: `${stack.stackName}-AppSync`,
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, "schema.graphql")
      ),
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: props.userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.IAM,
          },
        ],
      },
      xrayEnabled: true,
    });

    const pipelineDS = api.addDynamoDbDataSource(
      "PipelineDataSource",
      props.pipelineDdb
    );

    const lambdaDS = api.addLambdaDataSource(
      "LocationFnDataSource",
      props.locationDataFn
    );

    pipelineDS.createResolver("UpsertPipelineResolver", {
      typeName: "Mutation",
      fieldName: "pipeline",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
       {
         "version": "2017-02-28",
         "operation": "UpdateItem",
         "key" : {
             "Id" : $util.dynamodb.toDynamoDBJson($ctx.arguments.input["Id"])
         },
         "update": {
           "expression": "SET #StatusUpdatedAt = :StatusUpdatedAt, #PipelineStatus = :PipelineStatus #if($ctx.arguments.input["UserId"] != $null),#UserId = :UserId#end #if($ctx.arguments.input["DataUploadedAt"] != $null),#DataUploadedAt = :DataUploadedAt#end #if($ctx.arguments.input["PredictorArn"] != $null),#PredictorArn = :PredictorArn#end #if($ctx.arguments.input["ForecastArn"] != $null),#ForecastArn = :ForecastArn#end #if($ctx.arguments.input["ExportJobArn"] != $null),#ExportJobArn = :ExportJobArn#end #if($ctx.arguments.input["ModelDrift"] != $null),#ModelDrift = :ModelDrift#end #if($ctx.arguments.input["RawDataUri"] != $null),#RawDataUri = :RawDataUri#end #if($ctx.arguments.input["RawDataSize"] != $null),#RawDataSize = :RawDataSize#end #if($ctx.arguments.input["PluginUploadedAt"] != $null),#PluginUploadedAt = :PluginUploadedAt#end #if($ctx.arguments.input["ProcFinishedAt"] != $null),#ProcFinishedAt = :ProcFinishedAt#end #if($ctx.arguments.input["DataImportedAt"] != $null),#DataImportedAt = :DataImportedAt#end #if($ctx.arguments.input["TrainingFinishedAt"] != $null),#TrainingFinishedAt = :TrainingFinishedAt#end #if($ctx.arguments.input["ForecastGeneratedAt"] != $null),#ForecastGeneratedAt = :ForecastGeneratedAt#end #if($ctx.arguments.input["ForecastExportedAt"] != $null),#ForecastExportedAt = :ForecastExportedAt#end #if($ctx.arguments.input["CleaningFinishedAt"] != $null),#CleaningFinishedAt = :CleaningFinishedAt#end #if($ctx.arguments.input["DataGroupArn"] != $null),#DataGroupArn = :DataGroupArn#end #if($ctx.arguments.input["PreProcessingId"] != $null),#PreProcessingId = :PreProcessingId#end #if($ctx.arguments.input["PostProcessingId"] != $null),#PostProcessingId = :PostProcessingId#end #if($ctx.arguments.input["PluginScriptUri"] != $null),#PluginScriptUri = :PluginScriptUri#end #if($ctx.arguments.input["TrainingDataUri"] != $null),#TrainingDataUri = :TrainingDataUri#end #if($ctx.arguments.input["OriginalDatasetName"] != $null),#OriginalDatasetName = :OriginalDatasetName#end #if($ctx.arguments.input["OriginalPluginName"] != $null),#OriginalPluginName = :OriginalPluginName#end #if($ctx.arguments.input["ErrorMessage"] != $null),#ErrorMessage = :ErrorMessage#end #if($ctx.arguments.input["DataCheckpoint"] != $null),#DataCheckpoint = :DataCheckpoint#end #if($ctx.arguments.input["PipelineRetraining"] != $null),#PipelineRetraining = :PipelineRetraining#end",
           "expressionNames": {
             "#StatusUpdatedAt": "StatusUpdatedAt",
             "#PipelineStatus": "PipelineStatus"
             #if($ctx.arguments.input["UserId"] != $null),"#UserId": "UserId"#end
             #if($ctx.arguments.input["RawDataUri"] != $null),"#RawDataUri": "RawDataUri"#end
             #if($ctx.arguments.input["RawDataSize"] != $null),"#RawDataSize": "RawDataSize"#end
             #if($ctx.arguments.input["DataUploadedAt"] != $null),"#DataUploadedAt": "DataUploadedAt"#end
             #if($ctx.arguments.input["PluginUploadedAt"] != $null),"#PluginUploadedAt": "PluginUploadedAt"#end
             #if($ctx.arguments.input["ProcFinishedAt"] != $null),"#ProcFinishedAt": "ProcFinishedAt"#end
             #if($ctx.arguments.input["DataImportedAt"] != $null),"#DataImportedAt": "DataImportedAt"#end
             #if($ctx.arguments.input["TrainingFinishedAt"] != $null),"#TrainingFinishedAt": "TrainingFinishedAt"#end
             #if($ctx.arguments.input["ForecastGeneratedAt"] != $null),"#ForecastGeneratedAt": "ForecastGeneratedAt"#end
             #if($ctx.arguments.input["ForecastExportedAt"] != $null),"#ForecastExportedAt": "ForecastExportedAt"#end
             #if($ctx.arguments.input["CleaningFinishedAt"] != $null),"#CleaningFinishedAt": "CleaningFinishedAt"#end
             #if($ctx.arguments.input["DataGroupArn"] != $null),"#DataGroupArn": "DataGroupArn"#end
             #if($ctx.arguments.input["PreProcessingId"] != $null),"#PreProcessingId": "PreProcessingId"#end
             #if($ctx.arguments.input["PluginScriptUri"] != $null),"#PluginScriptUri": "PluginScriptUri"#end
             #if($ctx.arguments.input["TrainingDataUri"] != $null),"#TrainingDataUri": "TrainingDataUri"#end
             #if($ctx.arguments.input["PredictorArn"] != $null),"#PredictorArn": "PredictorArn"#end
             #if($ctx.arguments.input["ForecastArn"] != $null),"#ForecastArn": "ForecastArn"#end
             #if($ctx.arguments.input["ModelDrift"] != $null),"#ModelDrift": "ModelDrift"#end
             #if($ctx.arguments.input["ExportJobArn"] != $null),"#ExportJobArn": "ExportJobArn"#end
             #if($ctx.arguments.input["PostProcessingId"] != $null),"#PostProcessingId": "PostProcessingId"#end
             #if($ctx.arguments.input["OriginalDatasetName"] != $null),"#OriginalDatasetName": "OriginalDatasetName"#end
             #if($ctx.arguments.input["OriginalPluginName"] != $null),"#OriginalPluginName": "OriginalPluginName"#end
             #if($ctx.arguments.input["ErrorMessage"] != $null),"#ErrorMessage": "ErrorMessage"#end
             #if($ctx.arguments.input["DataCheckpoint"] != $null),"#DataCheckpoint": "DataCheckpoint"#end
             #if($ctx.arguments.input["PipelineRetraining"] != $null),"#PipelineRetraining": "PipelineRetraining"#end
           },
           "expressionValues" : {
             ":StatusUpdatedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["StatusUpdatedAt"]),
             ":PipelineStatus": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PipelineStatus"])
             #if($ctx.arguments.input["UserId"] != $null),":UserId": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["UserId"])#end
             #if($ctx.arguments.input["RawDataUri"] != $null),":RawDataUri": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["RawDataUri"])#end
             #if($ctx.arguments.input["RawDataSize"] != $null),":RawDataSize": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["RawDataSize"])#end
             #if($ctx.arguments.input["DataUploadedAt"] != $null),":DataUploadedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["DataUploadedAt"])#end
             #if($ctx.arguments.input["PluginUploadedAt"] != $null),":PluginUploadedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PluginUploadedAt"])#end
             #if($ctx.arguments.input["ProcFinishedAt"] != $null),":ProcFinishedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ProcFinishedAt"])#end
             #if($ctx.arguments.input["DataImportedAt"] != $null),":DataImportedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["DataImportedAt"])#end
             #if($ctx.arguments.input["TrainingFinishedAt"] != $null),":TrainingFinishedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["TrainingFinishedAt"])#end
             #if($ctx.arguments.input["ForecastGeneratedAt"] != $null),":ForecastGeneratedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ForecastGeneratedAt"])#end
             #if($ctx.arguments.input["ForecastExportedAt"] != $null),":ForecastExportedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ForecastExportedAt"])#end
             #if($ctx.arguments.input["CleaningFinishedAt"] != $null),":CleaningFinishedAt": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["CleaningFinishedAt"])#end
             #if($ctx.arguments.input["DataGroupArn"] != $null),":DataGroupArn": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["DataGroupArn"])#end
             #if($ctx.arguments.input["PreProcessingId"] != $null),":PreProcessingId": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PreProcessingId"])#end
             #if($ctx.arguments.input["PluginScriptUri"] != $null),":PluginScriptUri": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PluginScriptUri"])#end
             #if($ctx.arguments.input["TrainingDataUri"] != $null),":TrainingDataUri": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["TrainingDataUri"])#end
             #if($ctx.arguments.input["PredictorArn"] != $null),":PredictorArn": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PredictorArn"])#end
             #if($ctx.arguments.input["ForecastArn"] != $null),":ForecastArn": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ForecastArn"])#end
             #if($ctx.arguments.input["ModelDrift"] != $null),":ModelDrift": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ModelDrift"])#end
             #if($ctx.arguments.input["ExportJobArn"] != $null),":ExportJobArn": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ExportJobArn"])#end
             #if($ctx.arguments.input["PostProcessingId"] != $null),":PostProcessingId": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PostProcessingId"])#end
             #if($ctx.arguments.input["OriginalDatasetName"] != $null),":OriginalDatasetName": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["OriginalDatasetName"])#end
             #if($ctx.arguments.input["OriginalPluginName"] != $null),":OriginalPluginName": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["OriginalPluginName"])#end
             #if($ctx.arguments.input["ErrorMessage"] != $null),":ErrorMessage": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["ErrorMessage"])#end
             #if($ctx.arguments.input["DataCheckpoint"] != $null),":DataCheckpoint": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["DataCheckpoint"])#end
             #if($ctx.arguments.input["PipelineRetraining"] != $null),":PipelineRetraining": $util.dynamodb.toDynamoDBJson($ctx.arguments.input["PipelineRetraining"])#end
            }
         }
     }
    `),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    pipelineDS.createResolver("GetPipelineByUser", {
      typeName: "Query",
      fieldName: "getPipelinesByUser",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
          {
            "version" : "2017-02-28",
            "operation" : "Scan",
            "filter" : {
              "expression": "UserId = :UserId",
                "expressionValues" : {
                  ":UserId" : $util.dynamodb.toDynamoDBJson($context.arguments.UserId)
                }
            }
          }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        "$util.toJson($ctx.result.items)"
      ),
    });

    pipelineDS.createResolver("PostProcessingId", {
      typeName: "Query",
      fieldName: "getPipelineByProcessingId",
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
          {
            "version" : "2017-02-28",
            "operation" : "Scan",
            "filter" : {
              "expression": "PostProcessingId = :PostProcessingId",
                "expressionValues" : {
                  ":PostProcessingId" : $util.dynamodb.toDynamoDBJson($context.arguments.PostProcessingId)
                }
            }
          }
      `),
      responseMappingTemplate: appsync.MappingTemplate.fromString(
        "$util.toJson($ctx.result.items)"
      ),
    });

    pipelineDS.createResolver("GetPipelineById", {
      typeName: "Query",
      fieldName: "getPipelineById",
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem(
        "Id",
        "Id"
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    });

    lambdaDS.createResolver("GetLocationData", {
      typeName: "Query",
      fieldName: "getLocationData",
      requestMappingTemplate: appsync.MappingTemplate.lambdaRequest(),
      responseMappingTemplate: appsync.MappingTemplate.lambdaResult(),
    });

    this.appSyncApi = api;
  }
}
