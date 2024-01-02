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

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

/**
 * Reads battery data from csv file and returns as array
 * @param event
 */
function getBatteryData(event: any) {
  const locationData: any[] = [];
  return new Promise(async (resolve) => {
    try {
      const getObjectParams = {
        Bucket: process.env.BUCKET,
        Key: process.env.KEY,
      };
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const resp = await s3.send(getObjectCommand);
      const file_stream: any = resp.Body;

      file_stream
        .pipe(csv(["BatteryId", "Lng", "Lat", "Country", "City", "VIN"]))
        .on("data", (data: any) => {
          locationData.push(data);
        })
        .on("end", () => {
          resolve(locationData);
        });
    } catch (err) {
      console.log("Cannot read file");
    }
  });
}

/**
 * Handler of the lambda function
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data;
  try {
    data = await getBatteryData(event);
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}
