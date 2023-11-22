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
const csv = require("csv-parser");

import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

/**
 * Get signed Url for upload
 * @param event
 */
async function getSignedURL(event: any): Promise<string> {
  let Key = event.queryStringParameters["fileName"];
  let ContentType = Key.includes(".csv") ? "text/csv" : "text/x-python";
  const putObjectParams = {
    Bucket: process.env.BUCKET,
    Key,
    ContentType,
  };

  const putObjectCommand: PutObjectCommand = new PutObjectCommand(
    putObjectParams
  );
  return await getSignedUrl(s3, putObjectCommand, { expiresIn: 300 });
}

/**
 * Returns metadata including all the batteries and cells
 * @param event
 */
async function getMetadata(event: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const getObjectParams = {
        Bucket: process.env.CDK_BUCKET,
        Key: process.env.KEY
      };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const response: any = await s3.send(getObjectCommand)
      // Store all data chunks returned from the response data stream
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks: string[] = [];

      // Handle an error while streaming the response body
      response.Body.once('error', (err: any) => reject(err))

      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on('data', (chunk: any) => responseDataChunks.push(chunk))

      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once('end', () => resolve(responseDataChunks.join('')))
    } catch (err) {
      // Handle the error or throw
      return reject(err)
    }
  });
}

/**
 * Reads battery data from csv file and returns as array
 * @param event
 */
function getBatteryData(event: any) {
  const batteryData: any[] = [];
  return new Promise(async (resolve) => {
    try {
      const battery = event.queryStringParameters.battery;
      const type = event.queryStringParameters.type;
      let Key = `${event.queryStringParameters["key"]}/${event.queryStringParameters["uuid"]}/plot/${type}/${battery}.csv`;
      const getObjectParams = {
        Bucket: process.env.BUCKET,
        Key,
      };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const resp = await s3.send(getObjectCommand);
      const file_stream: any = resp.Body;

      file_stream
        .pipe(csv())
        .on("data", (data: any) => {
          batteryData.push(data);
        })
        .on("end", () => {
          resolve(batteryData);
        });
    } catch (err) {
      console.log("Cannot read file");
    }
  });
}

async function copyDataset(event: any) {
  const s3Uri = event.queryStringParameters.uri;
  const Key = event.queryStringParameters.key;
  let CopySource = '';
  if (s3Uri) {
    CopySource = s3Uri.replace("s3://", "");
  }
  const params = {
    CopySource,
    Key,
    Bucket: process.env.BUCKET
  };
  const copyObjectCommand = new CopyObjectCommand(params);
  await s3.send(copyObjectCommand);
  return "Copied File Successfully";
}

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

function determineAction(event: any) {
  let action = "GSU";
  if (event.queryStringParameters && event.queryStringParameters.action) {
    action = event.queryStringParameters.action;
  }
  return action;
}

/**
 * Handler of the lambda function
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data;
  try {
    const action = determineAction(event);
    if (action === "GSU") {
      data = await getSignedURL(event);
    } else if (action === "GM") {
      data = await getMetadata(event);
    } else if (action === "GBD") {
      data = await getBatteryData(event);
    } else if (action === "CD") {
      data = await copyDataset(event);
    }
    return build_response(200, data);
  } catch (err) {
    console.error(err);
    return build_response(500, "Server Error");
  }
}
