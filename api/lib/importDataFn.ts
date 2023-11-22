/**
Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License").
You may not use this file except in compliance with the License.
A copy of the License is located at

  http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied. See the License for the specific language governing
permissions and limitations under the License.
*/

import { fromEnv } from "@aws-sdk/credential-providers";
import { AppSyncClient } from "./appsync";
import {
  ForecastClient,
  ListDatasetGroupsCommand,
  CreateDatasetGroupCommand,
  UpdateDatasetGroupCommand,
  ListDatasetsCommand,
  CreateDatasetCommand,
  CreateDatasetImportJobCommand,
} from "@aws-sdk/client-forecast";

const fcast = new ForecastClient({ region: process.env.AWS_REGION });
const appSync = new AppSyncClient({
  graphQlUrl: process.env.APPSYNC_GRAPHQL_URL!,
  credentials: fromEnv(),
});

/**
 * Builds response before sending back to UI
 * @param http_code
 * @param body
 */
function build_response(http_code: number, body: any) {
  return {
    headers: {
      "Cache-Control": "no-cache, no-store", // tell cloudfront and api gateway not to cache the response
      "Content-Type": "application/json",
    },
    statusCode: http_code,
    body: JSON.stringify(body),
  };
}

/**
 * Import training dataset into Forecast
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data: String[] = [];
  let pipeId: String = "";

  try {
    const bucket = event["detail"]["bucket"]["name"];
    const file = event["detail"]["object"];
    const userId = file["key"].split("/")[0];
    pipeId = file["key"].split("/")[1];
    const fcastId = `${userId}_${pipeId}`;

    // Check if DSG for id already exists
    const dsgList = await fcast.send(new ListDatasetGroupsCommand({}));

    // Find expected DSG in group
    let dsg = dsgList.DatasetGroups?.find(
      (grp: any) => grp.DatasetGroupName === fcastId
    );

    // Create DSG construct if not already existing
    if (!dsg) {
      dsg = await fcast.send(
        new CreateDatasetGroupCommand({
          DatasetGroupName: fcastId,
          Domain: "CUSTOM",
        })
      );
    }

    data.push(`Dataset Group construct ready: ${dsg.DatasetGroupArn}`);

    // Check if dataset for id already exists
    const dsList = await fcast.send(new ListDatasetsCommand({}));

    // Find expected dataset in group
    let ds = dsList.Datasets?.find((grp: any) => grp.DatasetName === fcastId);

    // Create dataset construct if not already existing
    if (!ds) {
      ds = await fcast.send(
        new CreateDatasetCommand({
          DatasetName: fcastId,
          DatasetType: "TARGET_TIME_SERIES",
          Domain: "CUSTOM",
          DataFrequency: process.env.DATASET_FREQUENCY,
          Schema: {
            Attributes: [
              { AttributeName: "timestamp", AttributeType: "timestamp" },
              { AttributeName: "item_id", AttributeType: "string" },
              { AttributeName: "target_value", AttributeType: "float" },
            ],
          },
        })
      );
    }

    data.push(`Dataset construct ready: ${ds.DatasetArn}`);

    // Add Dataset to Dataset Group
    await fcast.send(
      new UpdateDatasetGroupCommand({
        DatasetGroupArn: dsg.DatasetGroupArn,
        DatasetArns: [`${ds.DatasetArn}`],
      })
    );

    data.push(
      `Dataset ${ds.DatasetName} added to Group ${dsg.DatasetGroupName}`
    );

    // Import training dataset into Forecast
    const importJob = await fcast.send(
      new CreateDatasetImportJobCommand({
        DatasetImportJobName: `${fcastId}_${Date.now()}`,
        DatasetArn: ds.DatasetArn,
        DataSource: {
          S3Config: {
            Path: `s3://${bucket}/${file["key"]}`,
            RoleArn: process.env.SERVICE_ROLE_ARN,
          },
        },
      })
    );

    data.push(`Initiated dataset import: ${importJob.DatasetImportJobArn}`);

    // Update pipeline info in ddb table
    await appSync.post({
      query: `mutation MyMutation($input: PipelineRequestInput!) {
        pipeline(input: $input) { Id PipelineStatus StatusUpdatedAt }
      }`,
      variables: {
        input: {
          Id: pipeId,
          ProcFinishedAt: event["time"],
          TrainingDataUri: `s3://${bucket}/${file["key"]}`,
          DataGroupArn: dsg.DatasetGroupArn,
          PipelineStatus: process.env.PIPELINE_STATUS,
          StatusUpdatedAt: new Date().toISOString(),
        },
      },
    });
    data.push(`Pipeline status updated to ${process.env.PIPELINE_STATUS}`);

    return build_response(200, data);
  } catch (err: any) {
    console.error(err);

    // Update pipeline info in ddb table
    await appSync.post({
      query: `mutation MyMutation($input: PipelineRequestInput!) {
        pipeline(input: $input) { Id PipelineStatus StatusUpdatedAt }
      }`,
      variables: {
        input: {
          Id: pipeId,
          ErrorMessage: err.message!,
          PipelineStatus: process.env.PIPELINE_STATUS,
          StatusUpdatedAt: new Date().toISOString(),
        },
      },
    });
    data.push(`${err.name}: ${err.message}`);

    return build_response(500, data);
  }
}
