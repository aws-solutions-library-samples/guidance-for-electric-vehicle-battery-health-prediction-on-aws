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

export const environment = {
  production: true,
  NG_APP_NAME: process.env["CUSTOMER_NAME"] ?? "Smart Battery Manager",
  NG_APP_LOGO: process.env["CUSTOMER_LOGO"] ?? "/assets/logos/logo.png",
  NG_APP_API: "",
  NG_APP_REGION: "",
  NG_APP_USER_POOL_ID: "",
  NG_APP_IDENTITY_POOL_ID: "",
  NG_APP_APP_CLIENT_ID: "",
  NG_APP_DATASET_URI: "",
  NG_APP_PLUGIN_URI: "",
  development: false,
  API_GW_URL: "",
  EATRON_API_KEY: "",
};
