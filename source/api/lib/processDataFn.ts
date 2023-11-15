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

import {
  GlueClient,
  CreateJobCommand,
  StartJobRunCommand,
} from "@aws-sdk/client-glue";
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
    const bucket = event["detail"]["bucket"]["name"];
    const file = event["detail"]["object"];
    const pipePrefix = file["key"].substring(0, file["key"].lastIndexOf("/"));
    pipeId = file["key"].split("/")[1];

    // Create Glue job from processing script
    const job = await glue.send(
      new CreateJobCommand({
        Name: `${pipeId}`,
        Role: process.env.SERVICE_ROLE_ARN,
        Command: {
          Name: "glueetl",
          PythonVersion: "3",
          ScriptLocation: `s3://${bucket}/${pipePrefix}/${process.env.PLUGIN_SCRIPT_KEY}`,
        },
        DefaultArguments: {
          "--s3_bucket": bucket,
          "--raw_dataset_key": file["key"],
          "--data_checkpoint": process.env.DATA_CHECKPOINT!,
        },
        GlueVersion: "3.0",
      })
    );

    data.push(`Glue job created: ${job["Name"]}`);

    // Kick off glue job
    const run = await glue.send(
      new StartJobRunCommand({ JobName: job["Name"] })
    );

    data.push(
      `Preprocessing initiated with checkpoint at ${process.env.DATA_CHECKPOINT}`
    );

    await update_ddb(pipeId, {
      DataUploadedAt: event["time"],
      RawDataUri: `s3://${bucket}/${file["key"]}`,
      RawDataSize: file["size"],
      PreProcessingId: run["JobRunId"],
      DataCheckpoint: process.env.DATA_CHECKPOINT,
    });
    data.push(`Pipeline status updated to ${process.env.PIPELINE_STATUS}`);

    return build_response(200, data);
  } catch (err: any) {
    console.error(err);

    await update_ddb(pipeId, { ErrorMessage: err.message! });
    data.push(`${err.name}: ${err.message}`);

    return build_response(500, data);
  }
}
