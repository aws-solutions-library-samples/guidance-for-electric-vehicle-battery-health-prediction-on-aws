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

import { S3Client } from "@aws-sdk/client-s3";
import { API } from "aws-amplify";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const mutation = `
  mutation createNote(note: NoteInput!) {
    createNote(note: $note) {
      name completed
    }
  }
`;

/**
 * Reads battery data from csv file and returns as array
 * @param event
 */
function publishBatteryData(event: any) {
  API.graphql({
    query: mutation,
    variables: { note: { name: "Note 1", completed: false } },
  });
  console.log("note successfully created!");
}

/**
 * Handler of the lambda function
 * @param event
 * @param context
 */
export async function handler(event?: any, context?: any) {
  let data;
  try {
    console.info(event);
    data = await publishBatteryData(event);
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}
