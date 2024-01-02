/**
 * Copyright 2022 Amazon.com, Inc. and its affiliates. All Rights Reserved.
 *
 * Licensed under the Amazon Software License (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://aws.amazon.com/asl/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { request as httpsRequest } from "https";
import { IncomingMessage, request as httpRequest, RequestOptions } from "http";
import { pipeline, Writable } from "stream";

type FetchRequestOptions = RequestOptions & {
  responseTimeout?: number;
};

/**
 * Execute a HTTPS request
 * @param uri - The URI
 * @param requestOptions - The RequestOptions to use
 * @param data - Data to send to the URI (e.g. POST data)
 */
export async function fetchJson<ResultType = {}>(
  uri: string,
  requestOptions?: FetchRequestOptions,
  data?: Buffer
) {
  let responseTimeout: NodeJS.Timeout;
  return new Promise<ResultType>((resolve, reject) => {
    const fn = uri.startsWith("https") ? httpsRequest : httpRequest;
    const req = fn(
      uri,
      {
        method: "GET",
        ...requestOptions,
      },
      (res) => {
        let handleResponseBody = (buf: Buffer) =>
          resolve(JSON.parse(buf.toString()));
        try {
          // Check response status and headers
          checkResponse(res, uri);
        } catch (err) {
          handleResponseBody = (buf: Buffer) => {
            (err as Error).message += ` ${JSON.stringify(
              buf.toString().replace(/\s+/g, " ")
            )}`;
            done(err as Error);
          };
        }

        // Capture response data
        pipeline([res, collectBuffer(handleResponseBody)], done);
      }
    );

    if (requestOptions?.responseTimeout) {
      responseTimeout = setTimeout(
        () =>
          done(
            new ResponseTimeoutError(
              uri,
              `Response time-out (after ${requestOptions.responseTimeout} ms.)`
            )
          ),
        requestOptions.responseTimeout
      );
    }

    function done(error?: Error | null) {
      if (responseTimeout) clearTimeout(responseTimeout);
      if (!error) return;
      req.socket?.emit("agentRemove");
      req.destroy(error);
      reject(error);
    }

    // Handle errors while sending request
    req.on("error", done);

    // Signal end of request (include optional data)
    req.end(data);
  });
}

function checkResponse(res: IncomingMessage, uri: string) {
  if (res.statusCode == 429) {
    throw new FetchError(uri, "Too many requests");
  } else if (res.statusCode !== 200) {
    throw new NonRetryableFetchError(
      uri,
      `Status code is ${res.statusCode}, expected 200`
    );
  }
  const match = res.headers["content-type"]?.match(
    /^(?<contentType>application\/json)\s*(;(\s*)charset=(?<charSet>.+))?/i
  );
  if (match?.groups?.contentType !== "application/json") {
    throw new NonRetryableFetchError(
      uri,
      `Content-type is "${res.headers["content-type"]}", expected "application/json"`
    );
  }
}

/**
 * Custom NodeJS writeable stream that collects chunks written to it in memory,
 * and invokes the supplied callback with the concatenated chunks upon finalization.
 *
 * @param callback - The callback to invoke upon finalization
 */
const collectBuffer = (callback: (collectedBuffer: Buffer) => void) => {
  const chunks = [] as Buffer[];
  return new Writable({
    write: (chunk, _encoding, done) => {
      try {
        chunks.push(chunk);
        done();
      } catch (err) {
        done(err as Error);
      }
    },
    final: (done) => {
      try {
        callback(Buffer.concat(chunks));
        done();
      } catch (err) {
        done(err as Error);
      }
    },
  });
};

export class FetchError extends Error {
  constructor(uri: string, msg: any) {
    super(`Failed to fetch ${uri}: ${msg}`);
  }
}

export class NonRetryableFetchError extends FetchError {}

export class ResponseTimeoutError extends FetchError {}
