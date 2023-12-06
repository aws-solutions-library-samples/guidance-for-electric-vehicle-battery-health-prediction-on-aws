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
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    API_URL: string = "";
    EATRON_API_URL = "";

    constructor(private http: HttpClient) {
        if (environment.development && environment.API_GW_URL!= "") {
            this.API_URL = environment.API_GW_URL;
        } else {
            this.API_URL = environment.NG_APP_API;
        }

        // this.EATRON_API_URL = "https://cloud.dev.eatron.com/bmc/v2";
        this.EATRON_API_URL = "http://localhost:4000/bmc/v2";
    }

    getSignedUrl(key: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/api/link?fileName=${key}&action=GSU`);
    }

    getMetadata(key: string, uuid: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/api/metadata?key=${key}&uuid=${uuid}&action=GM`)
    }

    getBatteryData(key: string, uuid: string, battery: string, type: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/api/metadata?key=${key}&uuid=${uuid}&battery=${battery}&type=${type}&action=GBD`)
    }

    uploadFile(signedURL: string, file: File, contentType: string): Observable<any> {
        return this.http.put<any>(signedURL, file, {
            headers: new HttpHeaders({"Content-Type": contentType}),
        });
    }

    simulate(id: string, fileName: string): Observable<any> {
        return this.http.get(`${this.API_URL}/api/simulation?key=${id}&file=${fileName}&action=SS`);
    }

    copyFile(uri: string | undefined, key: string | undefined) {
        return this.http.get<any>(`${this.API_URL}/api/metadata?uri=${uri}&key=${key}&action=CD`);
    }

    retrainPipeline(checkpoint: number, uuid: string) {
        return this.http.get<any>(`${this.API_URL}/api/retrain?checkpoint=${checkpoint}&uuid=${uuid}`);
    }

    refreshBatteryHealth(battery: string) {
        return this.http.post<any>(`${this.API_URL}/api/refresh?battery=${battery}`,null);
    }
}
