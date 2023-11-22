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
  CreateForecastExportJobCommand,
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

// Update pipeline info in ddb table
async function update_ddb(pipeId: string, inputValues: object) {
  await appSync.post({
    query: `mutation MyMutation($input: PipelineRequestInput!) {
      pipeline(input: $input) { Id PipelineStatus StatusUpdatedAt }
    }`,
    variables: {
      input: {
        ...inputValues,
        Id: pipeId,
        PipelineStatus: process.env.PIPELINE_STATUS,
        StatusUpdatedAt: new Date().toISOString(),
      },
    },
  });
}

/**
 * Import training dataset into Forecast
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data: String[] = [];
  let pipeId: string = "";

  try {
    //arn:aws:forecast:us-east-1:157670018337:forecast/adi_uuid_1677324841398
    const fcastArn = event["resources"][0];
    const arnId = fcastArn.split("/")[1];
    const fcastId = arnId.substring(0, arnId.lastIndexOf("_"));
    pipeId = fcastId.split("_")[1];

    const status = event["detail"]["status"];
    if (status === "ACTIVE") {
      // TODO: this can just be reconstructed from userId and pipeId
      // Get S3 URI for pipe data from stored ddb entry
      const pipeData = await appSync.post({
        query: `query ($Id: String!) {
        getPipelineById(Id: $Id) {
          RawDataUri
        }
      }`,
        variables: { Id: pipeId },
      });

      const rawDataUri = pipeData.data.getPipelineById.RawDataUri;
      const pipeDataUri = rawDataUri.substring(0, rawDataUri.lastIndexOf("/"));
      const fcastDataUri = `${pipeDataUri}/${process.env.FORECAST_OUTPUT_PREFIX}`;

      const exportJob = await fcast.send(
        new CreateForecastExportJobCommand({
          ForecastExportJobName: fcastId,
          ForecastArn: fcastArn,
          Format: "CSV",
          Destination: {
            S3Config: {
              Path: `${fcastDataUri}/`,
              RoleArn: process.env.SERVICE_ROLE_ARN,
            },
          },
        })
      );
      data.push(`Exporting forecast data to ${fcastDataUri}`);

      await update_ddb(pipeId, {
        ForecastGeneratedAt: event["time"],
        ExportJobArn: exportJob.ForecastExportJobArn,
      });
      data.push(`Pipeline status updated to ${process.env.PIPELINE_STATUS}`);
    } else {
      event["detail"]["name"] = status;
      throw event["detail"];
    }

    return build_response(200, data);
  } catch (err: any) {
    console.error(err);

    await update_ddb(pipeId, { ErrorMessage: err.message! });
    data.push(`${err.name}: ${err.message}`);

    return build_response(500, data);
  }
}
