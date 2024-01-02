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
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  API_URL = "";

  constructor(private http: HttpClient) {
    if (environment.development && environment.API_GW_URL != "") {
      this.API_URL = environment.API_GW_URL;
    } else {
      this.API_URL = environment.NG_APP_API;
    }
  }

  getConfig() {
    return this.http.get<any>(`${this.API_URL}/api/amplify-config`);
  }
}
