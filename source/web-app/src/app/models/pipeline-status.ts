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

export enum PipelineStatus {
  UPLOADING_DATASET = 1,
  PROCESSING_DATASET,
  IMPORTING_DATASET,
  TRAINING_PREDICTOR,
  GENERATING_FORECAST,
  EXPORTING_PREDICTIONS,
  CLEANING_EXPORTS,
  PIPELINE_FINISHED,
}
