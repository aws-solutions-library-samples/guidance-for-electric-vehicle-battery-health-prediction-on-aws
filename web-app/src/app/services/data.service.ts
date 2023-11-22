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

    constructor(private http: HttpClient) {
    }

    getSignedUrl(key: string): Observable<any> {
        return this.http.get<any>(`${environment.NG_APP_API}/api/link?fileName=${key}&action=GSU`);
    }

    getMetadata(key: string, uuid: string): Observable<any> {
        return this.http.get<any>(`${environment.NG_APP_API}/api/metadata?key=${key}&uuid=${uuid}&action=GM`)
    }

    getBatteryData(key: string, uuid: string, battery: string, type: string): Observable<any> {
        return this.http.get<any>(`${environment.NG_APP_API}/api/metadata?key=${key}&uuid=${uuid}&battery=${battery}&type=${type}&action=GBD`)
    }

    uploadFile(signedURL: string, file: File, contentType: string): Observable<any> {
        return this.http.put<any>(signedURL, file, {
            headers: new HttpHeaders({"Content-Type": contentType}),
        });
    }

    simulate(id: string, fileName: string): Observable<any> {
        return this.http.get(`${environment.NG_APP_API}/api/simulation?key=${id}&file=${fileName}&action=SS`);
    }

    copyFile(uri: string | undefined, key: string | undefined) {
        return this.http.get<any>(`${environment.NG_APP_API}/api/metadata?uri=${uri}&key=${key}&action=CD`);
    }

    retrainPipeline(checkpoint: number, uuid: string) {
        return this.http.get<any>(`${environment.NG_APP_API}/api/retrain?checkpoint=${checkpoint}&uuid=${uuid}`);
    }
}
