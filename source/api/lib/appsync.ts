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

import { Readable } from "stream";
import { promisify } from "util";
import { URL } from "url";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { fromString } from "@aws-sdk/util-buffer-from";
import { AwsCredentialIdentity, Provider } from "@aws-sdk/types";
import { fetchJson, NonRetryableFetchError } from "./https";
import { Agent } from "https";
import WebSocket = require("ws");
export { ResponseTimeoutError } from "./https";

export type TypedReadable<T> = Readable & {
  read: () => T;
  [Symbol.asyncIterator]: () => AsyncIterator<T>;
};

export type GraphQLResult<T> =
  | GraphQlResultWithData<T>
  | GraphQlResultWithErrors;
type GraphQlResultWithErrors = { errors: { message: string }[] };
type GraphQlResultWithData<T> = { data: T };
function isGraphQlResultWithErrors(
  result: GraphQLResult<any>
): result is GraphQlResultWithErrors {
  return !!(
    (result as GraphQlResultWithErrors).errors &&
    (result as GraphQlResultWithErrors).errors.length
  );
}
interface Retry {
  delay?: number;
  responseTimeout?: number;
}

type RetryStrategy = Iterable<Retry>;

export interface PostOptions {
  responseTimeout?: number;
  retryStrategy?: RetryStrategy;
}

export class AppSyncClient {
  graphqlUri: URL;
  realtimeUri: URL;
  region: string;
  private signer: SignatureV4;
  private ws?: WebSocket;
  private connected?: (connectionTimeoutMs: number) => void;
  private failedToConnect?: (err: Error) => void;
  private connecting?: Promise<WebSocket>;
  private connectionTimeoutMs?: number;
  private scheduledKeepAliveCheck?: NodeJS.Timeout;
  private lastSubscriptionId = 0;
  private establishedSubscriptionIds = new Set<string>();
  public subscribeAsync = promisify(this.subscribe);

  private subscriptionCallbacks: {
    [subscriptionId: string]: {
      data: (payload: any) => void;
      error?: (err: Error) => void;
      subscribed?: () => void;
      unsubscribe: (err?: Error) => void;
      unsubscribed?: () => void;
    };
  } = {};

  private keepAliveAgent: Agent;
  constructor(props: {
    graphQlUrl: string;
    realtimeUrl?: string;
    apiRegion?: string;
    credentials?: AwsCredentialIdentity | Provider<AwsCredentialIdentity>;
  }) {
    this.graphqlUri = new URL(props.graphQlUrl);
    this.region = props.apiRegion ?? this.graphqlUri.hostname.split(".")[2];
    this.realtimeUri = new URL(
      props.realtimeUrl ??
        `wss://${this.graphqlUri.hostname.split(".")[0]}.appsync-realtime-api.${
          this.region
        }.amazonaws.com/graphql`
    );

    this.keepAliveAgent = new Agent({
      keepAlive: true,
    });

    let credentials = props.credentials;
    if (!credentials) {
      try {
        credentials =
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          require("@aws-sdk/credential-provider-node").defaultProvider();
      } catch {
        throw new MissingCredentialsError(
          `No credentials provided. You should either provide credentials, or install "@aws-sdk/credential-provider-node"`
        );
      }
    }

    this.signer = new SignatureV4({
      service: "appsync",
      region: this.region,
      credentials: credentials!,
      sha256: Sha256,
    });
  }

  private getNewSubscriptionId() {
    return (++this.lastSubscriptionId % Number.MAX_SAFE_INTEGER).toString();
  }

  close() {
    this.closeWebSocket(
      new AppSyncClientClosingError("AppSync client has been closed")
    );
    this.closeKeepAliveAgent();
  }

  private closeKeepAliveAgent() {
    this.keepAliveAgent.destroy();
  }

  private closeAllSubscriptions(err?: Error) {
    Object.values(this.subscriptionCallbacks).forEach(({ unsubscribe }) =>
      unsubscribe(err)
    );
  }

  private closeWebSocket(err?: Error) {
    this.closeAllSubscriptions(err);
    if (this.ws) {
      this.ws.terminate();
    }
    if (this.scheduledKeepAliveCheck) {
      clearTimeout(this.scheduledKeepAliveCheck);
    }
  }

  private async sign(body: string, isConnectionAttempt = false) {
    return this.signer.sign({
      headers: {
        accept: "application/json, text/javascript",
        "content-encoding": "amz-1.0",
        "content-type": "application/json; charset=UTF-8",
        host: this.graphqlUri.hostname,
      },
      hostname: this.graphqlUri.hostname,
      method: "POST",
      path: isConnectionAttempt
        ? this.graphqlUri.pathname + "/connect"
        : this.graphqlUri.pathname,
      protocol: this.graphqlUri.protocol,
      body,
    });
  }

  private scheduleKeepAliveCheck() {
    if (this.scheduledKeepAliveCheck) {
      clearTimeout(this.scheduledKeepAliveCheck);
    }
    this.scheduledKeepAliveCheck = setTimeout(
      () =>
        this.closeWebSocket(
          new KeepAliveIntervalLapsedError(
            `Connection has become stale (did not receive a keep-alive message for ${this.connectionTimeoutMs} ms.)`
          )
        ),
      this.connectionTimeoutMs
    );
  }

  private async handleMessage(event: WebSocket.MessageEvent) {
    const parsed = JSON.parse(event.data.toString());
    if (event.data) {
      if (parsed.type === "connection_error") {
        this.failedToConnect!(
          new ConnectionError(extractGraphQlErrorMessage(parsed.payload))
        );
      } else if (parsed.type === "connection_ack") {
        this.connected!(parsed.payload!.connectionTimeoutMs);
      } else if (parsed.type === "error") {
        const subscriptionId = parsed.id;
        this.subscriptionCallbacks[subscriptionId].error!(
          GraphQlError.fromResultWithError(parsed.payload)
        );
      } else if (parsed.type === "start_ack") {
        const subscriptionId = parsed.id;
        this.subscriptionCallbacks[subscriptionId].subscribed!();
      } else if (parsed.type === "ka") {
        this.scheduleKeepAliveCheck();
      } else if (parsed.type === "data") {
        const subscriptionId = parsed.id;
        this.subscriptionCallbacks[subscriptionId].data(parsed.payload);
      } else if (parsed.type === "complete") {
        const subscriptionId = parsed.id;
        this.subscriptionCallbacks[subscriptionId].unsubscribed!();
      }
    }
  }

  public async connect() {
    if (this.connecting) {
      await this.connecting.catch(() => {});
    }
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return this.ws;
    }
    // eslint-disable-next-line no-async-promise-executor
    this.connecting = new Promise<WebSocket>(async (resolve, reject) => {
      try {
        const connectionAuth = await this.sign("{}", true);
        const connectionUrl = new URL(
          `?header=${fromString(
            JSON.stringify(connectionAuth.headers)
          ).toString("base64")}&payload=${fromString(
            JSON.stringify("{}")
          ).toString("base64")}`,
          this.realtimeUri
        );
        const ws = (this.ws = new WebSocket(connectionUrl.toString(), [
          "graphql-ws",
        ]));
        this.connected = (connectionTimeoutMs) => {
          this.connectionTimeoutMs = connectionTimeoutMs;
          this.scheduleKeepAliveCheck();
          resolve(ws);
        };
        this.failedToConnect = reject;
        ws.onerror = reject;
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "connection_init" }), (err) => {
            if (err) reject(err);
          });
        };
        ws.onmessage = this.handleMessage.bind(this);
        ws.onclose = () => {
          const error = new Error("Socket to AppSync closed prematurely");
          reject(error);
          this.closeAllSubscriptions(error);
        };
      } catch (err) {
        reject(err);
      }
    }).finally(() => delete this.connecting);
    return this.connecting;
  }

  public async post<T = any>(props: {
    query: string;
    variables?: { [key: string]: any };
    options?: PostOptions;
  }) {
    const graphql = JSON.stringify({
      query: props.query,
      variables: props.variables ?? {},
    });

    // eslint-disable-next-line no-constant-condition
    const responseTimeout = props.options?.responseTimeout ?? 3000;
    function* attempts(): RetryStrategy {
      yield { responseTimeout }; // 1st attempt
      yield* props.options?.retryStrategy ??
        generateRetryStrategy({
          retries: 2,
          baseResponseTimeout: responseTimeout * 1.3,
          responseTimeoutFactor: 2.5,
          delayFactor: 4,
        }); // retries
    }

    const errors: Error[] = [];
    for (const attempt of attempts()) {
      if (errors.length) {
        const lastError = errors[errors.length - 1];
        console.log(`[GraphQL Attempt ${errors.length}] ${lastError.message}`, {
          lastError,
          graphql,
        });
      }
      try {
        return await this._post<GraphQlResultWithData<T>>(
          graphql,
          attempt.responseTimeout ?? responseTimeout
        );
      } catch (err) {
        if (
          err instanceof NonRetryableFetchError ||
          err instanceof GraphQlError
        ) {
          throw err;
        }
        errors.push(err as Error);
      }
    }

    throw errors[errors.length - 1];
  }

  private async _post<T extends GraphQlResultWithData<any>>(
    graphql: string,
    responseTimeout: number
  ) {
    const signedRequest = await this.sign(graphql);
    const result = await fetchJson<T>(
      this.graphqlUri.toString(),
      {
        headers: signedRequest.headers,
        method: "POST",
        responseTimeout,
        agent: this.keepAliveAgent,
      },
      Buffer.from(graphql)
    );
    if (isGraphQlResultWithErrors(result)) {
      throw GraphQlError.fromResultWithError(result);
    }
    return result;
  }

  public subscribe<T = any>(
    props: {
      query: string;
      variables?: { [key: string]: any };
    },
    subscriptionReadyCallback?: (
      err: Error | null,
      readable: TypedReadable<GraphQlResultWithData<T>>
    ) => void
  ) {
    const subscriptionId = this.getNewSubscriptionId();
    const readable = this.createReadableStream(subscriptionId) as TypedReadable<
      GraphQlResultWithData<T>
    >;
    this.subscriptionCallbacks[subscriptionId] = {
      data: (result: GraphQLResult<T>) => {
        if (isGraphQlResultWithErrors(result)) {
          readable.destroy(GraphQlError.fromResultWithError(result));
        } else {
          readable.push(result);
        }
      },
      unsubscribe: readable.destroy.bind(readable),
    };
    this.appSyncSubscribe({
      ...props,
      subscriptionId,
    })
      .then(() => subscriptionReadyCallback?.(null, readable))
      .catch((err) => {
        readable.destroy();
        subscriptionReadyCallback?.(err, null as any);
      });
    return readable;
  }

  private async appSyncSubscribe(props: {
    query: string;
    variables?: { [key: string]: any };
    subscriptionId: string;
    subscriptionEstablishedTimeout?: number;
  }) {
    const subscriptionEstablishedTimeout =
      props.subscriptionEstablishedTimeout ?? 5000;
    const ws = await this.connect();
    const graphql = JSON.stringify({
      query: props.query,
      variables: props.variables ?? {},
    });
    const subscribeAuth = await this.sign(graphql);
    return new Promise<void>((resolve, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              `Timeout while establishing AppSync subscription ${props.subscriptionId} (after ${subscriptionEstablishedTimeout} ms.)`
            )
          ),
        subscriptionEstablishedTimeout
      );
      this.subscriptionCallbacks[props.subscriptionId].subscribed = () => {
        this.establishedSubscriptionIds.add(props.subscriptionId);
        resolve();
      };
      this.subscriptionCallbacks[props.subscriptionId].error = reject;
      ws.send(
        JSON.stringify({
          id: props.subscriptionId,
          payload: {
            data: graphql,
            extensions: {
              authorization: subscribeAuth.headers,
            },
          },
          type: "start",
        }),
        (err) => {
          if (err) reject(err);
        }
      );
    });
  }

  private createReadableStream(subscriptionId: string) {
    const appSyncClient = this;
    return new Readable({
      objectMode: true,
      destroy: function (err, cb) {
        if (err) {
          this.emit("error", err);
        } else {
          this.push(null); // This will end pipelines etc. cleanly
        }
        appSyncClient
          .unsubscribe(subscriptionId)
          .then(() => cb(null))
          .catch(cb);
      },
      read: () => {},
    });
  }

  private cleanUpAfterSubscription(subscriptionId: string) {
    delete this.subscriptionCallbacks[subscriptionId];
    this.establishedSubscriptionIds.delete(subscriptionId);
    if (Object.keys(this.subscriptionCallbacks).length === 0) {
      this.closeWebSocket();
    }
  }

  private async unsubscribe(subscriptionId: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.cleanUpAfterSubscription(subscriptionId);
      return;
    }
    if (!this.establishedSubscriptionIds.has(subscriptionId)) {
      this.cleanUpAfterSubscription(subscriptionId);
      return;
    }
    const ws = this.ws;
    await new Promise<void>((resolve, reject) => {
      this.subscriptionCallbacks[subscriptionId].unsubscribed = () => {
        this.cleanUpAfterSubscription(subscriptionId);
        resolve();
      };
      this.subscriptionCallbacks[subscriptionId].error = reject;
      ws.send(
        JSON.stringify({
          type: "stop",
          id: subscriptionId,
        }),
        (err) => {
          if (err) reject(err);
        }
      );
    });
  }
}

function extractGraphQlErrorMessage(result: GraphQlResultWithErrors) {
  if (result.errors.length === 1) {
    return result.errors[0].message.replace(/\s+/g, " ");
  }
  return JSON.stringify(result.errors).replace(/\s+/g, " ");
}

export function* generateRetryStrategy(options?: {
  retries: number;
  baseResponseTimeout?: number;
  responseTimeoutFactor?: number;
  baseDelay?: number;
  delayFactor?: number;
}): RetryStrategy {
  const baseDelay = options?.baseDelay ?? 50;
  const delayFactor = options?.delayFactor ?? 2;
  const baseResponseTimeout = options?.baseResponseTimeout ?? 300;
  const responseTimeoutFactor = options?.responseTimeoutFactor ?? 1.5;
  const retries = options?.retries ?? 3;
  for (let i = 0; i < retries; i++) {
    const delay = baseDelay * delayFactor ** i;
    yield {
      delay: delay + (Math.random() * delay) / 4, // Add jitter of max 25% of delay
      responseTimeout: baseResponseTimeout * responseTimeoutFactor ** i,
    };
  }
}

export class ConnectionError extends Error {}
export class GraphQlError extends Error {
  static fromResultWithError(result: GraphQlResultWithErrors) {
    return new GraphQlError(extractGraphQlErrorMessage(result));
  }
}
export class AppSyncClientClosingError extends Error {}
export class KeepAliveIntervalLapsedError extends Error {}
export class MissingCredentialsError extends Error {}
