
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

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: false,
    NG_APP_NAME: process.env['CUSTOMER_NAME'] ?? 'Smart Battery Manager',
    NG_APP_LOGO: process.env['CUSTOMER_LOGO'] ?? '/assets/logos/logo.png',
    NG_APP_API: "",
    NG_APP_REGION: "",
    NG_APP_USER_POOL_ID: "",
    NG_APP_IDENTITY_POOL_ID: "",
    NG_APP_APP_CLIENT_ID: "",
    NG_APP_DATASET_URI: "",
    NG_APP_PLUGIN_URI: ""
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
