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

import { GlueClient, StartJobRunCommand } from "@aws-sdk/client-glue";
import { fromEnv } from "@aws-sdk/credential-providers";
import { AppSyncClient } from "./appsync";

const glue = new GlueClient({ region: process.env.AWS_REGION });
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
 * Create and run Glue job on processor script upload
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data: String[] = [];
  let pipeId: string = "";

  try {
    // arn:aws:forecast:us-east-1:157670018337:forecast-export-job/adi_uuid_1677324841398/adi_uuid_1677340719323
    const fcastArn = event["resources"][0];
    const exportId = fcastArn.split("/")[2].split("_");
    const userId = exportId[0];
    pipeId = exportId[1];

    const status = event["detail"]["status"];
    if (status === "ACTIVE") {
      // Kick off post processing job
      const run = await glue.send(
        new StartJobRunCommand({
          JobName: process.env.GLUE_JOB_NAME,
          Arguments: {
            "--s3_bucket": process.env.DATA_BUCKET!,
            "--preds_path": `${userId}/${pipeId}/${process.env.FORECAST_OUTPUT_PREFIX}`,
          },
        })
      );
      data.push(`Glue job run initiated: ${run["JobRunId"]}`);

      await update_ddb(pipeId, {
        ForecastExportedAt: event["time"],
        PostProcessingId: run["JobRunId"],
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
