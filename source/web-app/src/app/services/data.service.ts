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
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  API_URL = "";
  EATRON_API_URL = "";
  EATRON_API_KEY = "";

  constructor(private http: HttpClient) {
    if (environment.development && environment.API_GW_URL != "") {
      this.API_URL = environment.API_GW_URL;
    } else {
      this.API_URL = environment.NG_APP_API;
    }

    this.EATRON_API_KEY = environment.EATRON_API_KEY;
    this.EATRON_API_URL = "https://cloud.us.eatron.com/api/v1";
  }

  getSignedUrl(key: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/api/link?fileName=${key}&action=GSU`
    );
  }

  getMetadata(key: string, uuid: string): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/api/metadata?key=${key}&uuid=${uuid}&action=GM`
    );
  }

  getBatteryData(
    key: string,
    uuid: string,
    battery: string,
    type: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.API_URL}/api/metadata?key=${key}&uuid=${uuid}&battery=${battery}&type=${type}&action=GBD`
    );
  }

  uploadFile(
    signedURL: string,
    file: File,
    contentType: string
  ): Observable<any> {
    return this.http.put<any>(signedURL, file, {
      headers: new HttpHeaders({ "Content-Type": contentType }),
    });
  }

  simulate(id: string, fileName: string): Observable<any> {
    return this.http.get(
      `${this.API_URL}/api/simulation?key=${id}&file=${fileName}&action=SS`
    );
  }

  copyFile(uri: string | undefined, key: string | undefined) {
    return this.http.get<any>(
      `${this.API_URL}/api/metadata?uri=${uri}&key=${key}&action=CD`
    );
  }

  retrainPipeline(checkpoint: number, uuid: string) {
    return this.http.get<any>(
      `${this.API_URL}/api/retrain?checkpoint=${checkpoint}&uuid=${uuid}`
    );
  }

  refreshBatteryHealth(battery: string) {
    return this.http.post<any>(
      `${this.API_URL}/api/refresh?battery=${battery}`,
      null
    );
  }

  getThermalRunawayResults(batteryId: string) {
    const headers = new HttpHeaders({"x-api-key": this.EATRON_API_KEY});
    const params = { batteryId: batteryId };
    return this.http.get<any>(`${this.EATRON_API_URL}/lithium-plating`, {
      headers: headers,
      params: params
    });
  }

  getLithiumPlatingResults(batteryId: string) {
    const headers = new HttpHeaders({"x-api-key": this.EATRON_API_KEY});
    const params = new HttpParams().set("batteryId", batteryId);
    return this.http.get<any>(`${this.EATRON_API_URL}/thermal-runaway`, {
      headers: headers,
      params: params
    });
  }

  getAccDegResults(batteryId: string) {
    const headers = new HttpHeaders({"x-api-key": this.EATRON_API_KEY});
    const params = new HttpParams().set("batteryId", batteryId);
    return this.http.get<any>(`${this.EATRON_API_URL}/acc-deg`, {
      headers: headers,
      params: params
    });
  }

  getAnalytics(
    batteryId: string,
    startTime: string,
    endTime: string
  ): Observable<any> {
    const headers = new HttpHeaders({"x-api-key": this.EATRON_API_KEY});
    return this.http.get<any>(
      `${this.EATRON_API_URL}/analytics/?batteryId=${batteryId}&startTime=${startTime}&endTime=${endTime}`,
      { headers: headers }
    );
  }

  getTriggerAnomalyResult(batteryId: string): Observable<any> {
    const URL =
      "https://m8afpaf8w4.execute-api.us-east-1.amazonaws.com/v1/trigger-anomaly";
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "x-api-key": "7AittF0Dde1b12mcRW2qV55Erwbqs6tS985BrENN",
    });
    return this.http.post<any>(
      `${URL}`,
      { vehicleId: batteryId },
      { headers: headers }
    );
  }
}
