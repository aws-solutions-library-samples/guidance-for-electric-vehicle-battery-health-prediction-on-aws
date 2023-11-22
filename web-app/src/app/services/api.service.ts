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

/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  pipelineSub: PipelineSubSubscription;
};

export type PipelineRequestInput = {
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type PipelineData = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type LocationData = {
  __typename: "LocationData";
  BatteryId: string;
  Lng: string;
  Lat: string;
  Country: string;
  City: string;
  VIN: string;
};

export type PipelineMutation = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type GetPipelinesByUserQuery = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type GetPipelineByIdQuery = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type GetPipelineByProcessingIdQuery = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

export type GetLocationDataQuery = {
  __typename: "LocationData";
  BatteryId: string;
  Lng: string;
  Lat: string;
  Country: string;
  City: string;
  VIN: string;
};

export type PipelineSubSubscription = {
  __typename: "PipelineData";
  Id: string;
  PipelineStatus: string;
  StatusUpdatedAt: string;
  UserId?: string | null;
  DataUploadedAt?: string | null;
  PluginUploadedAt?: string | null;
  ProcFinishedAt?: string | null;
  DataImportedAt?: string | null;
  TrainingFinishedAt?: string | null;
  ForecastGeneratedAt?: string | null;
  ForecastExportedAt?: string | null;
  CleaningFinishedAt?: string | null;
  DataGroupArn?: string | null;
  PreProcessingId?: string | null;
  RawDataSize?: number | null;
  RawDataUri?: string | null;
  PluginScriptUri?: string | null;
  TrainingDataUri?: string | null;
  PredictorArn?: string | null;
  ForecastArn?: string | null;
  ModelDrift?: number | null;
  ExportJobArn?: string | null;
  PostProcessingId?: string | null;
  OriginalDatasetName?: string | null;
  OriginalPluginName?: string | null;
  DataCheckpoint?: string | null;
  ErrorMessage?: string | null;
  PipelineRetraining?: boolean | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async Pipeline(input: PipelineRequestInput): Promise<PipelineMutation> {
    const statement = `mutation Pipeline($input: PipelineRequestInput!) {
        pipeline(input: $input) {
          __typename
          Id
          PipelineStatus
          StatusUpdatedAt
          UserId
          DataUploadedAt
          PluginUploadedAt
          ProcFinishedAt
          DataImportedAt
          TrainingFinishedAt
          ForecastGeneratedAt
          ForecastExportedAt
          CleaningFinishedAt
          DataGroupArn
          PreProcessingId
          RawDataSize
          RawDataUri
          PluginScriptUri
          TrainingDataUri
          PredictorArn
          ForecastArn
          ModelDrift
          ExportJobArn
          PostProcessingId
          OriginalDatasetName
          OriginalPluginName
          DataCheckpoint
          ErrorMessage
          PipelineRetraining
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <PipelineMutation>response.data.pipeline;
  }
  async GetPipelinesByUser(
    UserId: string
  ): Promise<Array<GetPipelinesByUserQuery>> {
    const statement = `query GetPipelinesByUser($UserId: String!) {
        getPipelinesByUser(UserId: $UserId) {
          __typename
          Id
          PipelineStatus
          StatusUpdatedAt
          UserId
          DataUploadedAt
          PluginUploadedAt
          ProcFinishedAt
          DataImportedAt
          TrainingFinishedAt
          ForecastGeneratedAt
          ForecastExportedAt
          CleaningFinishedAt
          DataGroupArn
          PreProcessingId
          RawDataSize
          RawDataUri
          PluginScriptUri
          TrainingDataUri
          PredictorArn
          ForecastArn
          ModelDrift
          ExportJobArn
          PostProcessingId
          OriginalDatasetName
          OriginalPluginName
          DataCheckpoint
          ErrorMessage
          PipelineRetraining
        }
      }`;
    const gqlAPIServiceArguments: any = {
      UserId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <Array<GetPipelinesByUserQuery>>response.data.getPipelinesByUser;
  }
  async GetPipelineById(Id: string): Promise<GetPipelineByIdQuery> {
    const statement = `query GetPipelineById($Id: String!) {
        getPipelineById(Id: $Id) {
          __typename
          Id
          PipelineStatus
          StatusUpdatedAt
          UserId
          DataUploadedAt
          PluginUploadedAt
          ProcFinishedAt
          DataImportedAt
          TrainingFinishedAt
          ForecastGeneratedAt
          ForecastExportedAt
          CleaningFinishedAt
          DataGroupArn
          PreProcessingId
          RawDataSize
          RawDataUri
          PluginScriptUri
          TrainingDataUri
          PredictorArn
          ForecastArn
          ModelDrift
          ExportJobArn
          PostProcessingId
          OriginalDatasetName
          OriginalPluginName
          DataCheckpoint
          ErrorMessage
          PipelineRetraining
        }
      }`;
    const gqlAPIServiceArguments: any = {
      Id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetPipelineByIdQuery>response.data.getPipelineById;
  }
  async GetPipelineByProcessingId(
    PostProcessingId: string
  ): Promise<Array<GetPipelineByProcessingIdQuery>> {
    const statement = `query GetPipelineByProcessingId($PostProcessingId: String!) {
        getPipelineByProcessingId(PostProcessingId: $PostProcessingId) {
          __typename
          Id
          PipelineStatus
          StatusUpdatedAt
          UserId
          DataUploadedAt
          PluginUploadedAt
          ProcFinishedAt
          DataImportedAt
          TrainingFinishedAt
          ForecastGeneratedAt
          ForecastExportedAt
          CleaningFinishedAt
          DataGroupArn
          PreProcessingId
          RawDataSize
          RawDataUri
          PluginScriptUri
          TrainingDataUri
          PredictorArn
          ForecastArn
          ModelDrift
          ExportJobArn
          PostProcessingId
          OriginalDatasetName
          OriginalPluginName
          DataCheckpoint
          ErrorMessage
          PipelineRetraining
        }
      }`;
    const gqlAPIServiceArguments: any = {
      PostProcessingId
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <Array<GetPipelineByProcessingIdQuery>>(
      response.data.getPipelineByProcessingId
    );
  }
  async GetLocationData(): Promise<Array<GetLocationDataQuery>> {
    const statement = `query GetLocationData {
        getLocationData {
          __typename
          BatteryId
          Lng
          Lat
          Country
          City
          VIN
        }
      }`;
    const response = (await API.graphql(graphqlOperation(statement))) as any;
    return <Array<GetLocationDataQuery>>response.data.getLocationData;
  }
  PipelineSubListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "pipelineSub">>
  > = API.graphql(
    graphqlOperation(
      `subscription PipelineSub {
        pipelineSub {
          __typename
          Id
          PipelineStatus
          StatusUpdatedAt
          UserId
          DataUploadedAt
          PluginUploadedAt
          ProcFinishedAt
          DataImportedAt
          TrainingFinishedAt
          ForecastGeneratedAt
          ForecastExportedAt
          CleaningFinishedAt
          DataGroupArn
          PreProcessingId
          RawDataSize
          RawDataUri
          PluginScriptUri
          TrainingDataUri
          PredictorArn
          ForecastArn
          ModelDrift
          ExportJobArn
          PostProcessingId
          OriginalDatasetName
          OriginalPluginName
          DataCheckpoint
          ErrorMessage
          PipelineRetraining
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "pipelineSub">>
  >;
}
