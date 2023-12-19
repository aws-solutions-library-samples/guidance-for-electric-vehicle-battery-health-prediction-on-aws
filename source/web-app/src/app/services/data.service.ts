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

    getFaults(batteryId: string) {
      const localhost_URL = "http://localhost:3000";
      //return this.http.get<any>(`${localhost_URL}/faults/?batteryId=${batteryId}`);
      const response = {
        "success": true,
        "message": [
            {
                "modelName": "Thermal Runaway",
                "status": 1,
                "data": [
                    [
                        "2022-12-13",
                        0.26576322990193263
                    ],
                    [
                        "2022-12-14",
                        0.2663459025448961
                    ],
                    [
                        "2022-12-15",
                        0.26692857518785956
                    ],
                    [
                        "2022-12-16",
                        0.2663459025448961
                    ],
                    [
                        "2022-12-17",
                        0.2663459025448961
                    ],
                    [
                        "2022-12-18",
                        0.2663459025448961
                    ]
                ],
                "predictions": [],
                "statistics": []
            },
            {
                "modelName": "Lithium Plating",
                "status": 1,
                "predictions": [
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
                ],
                "data": [
                    [
                        0,
                        0.26034358389177437
                    ],
                    [
                        1,
                        0.2732658222014451
                    ],
                    [
                        2,
                        0.2526359278042251
                    ],
                    [
                        3,
                        0.22580606624449667
                    ],
                    [
                        4,
                        0.2254362474785631
                    ],
                    [
                        5,
                        0.23242508436187584
                    ],
                    [
                        6,
                        0.22796175514238007
                    ],
                    [
                        7,
                        0.2925782287280578
                    ],
                    [
                        8,
                        0.2351751821931415
                    ],
                    [
                        9,
                        0.22462851628243394
                    ],
                    [
                        10,
                        0.2685853522160101
                    ],
                    [
                        11,
                        0.2726261103840848
                    ],
                    [
                        12,
                        0.18492402775379765
                    ],
                    [
                        13,
                        0.20308836230628302
                    ],
                    [
                        14,
                        0.2425173491286439
                    ],
                    [
                        15,
                        0.23741209135615027
                    ],
                    [
                        16,
                        0.2574617008932752
                    ],
                    [
                        17,
                        0.24394721956942667
                    ],
                    [
                        18,
                        0.25177604297307354
                    ],
                    [
                        19,
                        0.23098160736591597
                    ],
                    [
                        20,
                        0.2517408556772212
                    ],
                    [
                        21,
                        0.2776646127925958
                    ],
                    [
                        22,
                        0.2890505299254574
                    ],
                    [
                        23,
                        0.18750142809874806
                    ],
                    [
                        24,
                        0.3507820081004228
                    ],
                    [
                        25,
                        0.23936994983499935
                    ],
                    [
                        26,
                        0.24423355667093263
                    ],
                    [
                        27,
                        0.2300570066000575
                    ],
                    [
                        28,
                        0.22037955918677934
                    ],
                    [
                        29,
                        0.31601556712582085
                    ],
                    [
                        30,
                        0.23508513738485534
                    ],
                    [
                        31,
                        0.23621572550356684
                    ],
                    [
                        32,
                        0.199893650980171
                    ],
                    [
                        33,
                        0.22996145827717726
                    ],
                    [
                        34,
                        0.24709784201882637
                    ],
                    [
                        35,
                        0.2569772616766897
                    ],
                    [
                        36,
                        0.27784366013249073
                    ],
                    [
                        37,
                        0.19659692946701376
                    ],
                    [
                        38,
                        0.2595292040135334
                    ],
                    [
                        39,
                        0.3516063545452672
                    ],
                    [
                        40,
                        0.2548711551816431
                    ],
                    [
                        41,
                        0.18850427667527733
                    ],
                    [
                        42,
                        0.2522295510859312
                    ],
                    [
                        43,
                        0.1649323749146323
                    ],
                    [
                        44,
                        0.21507706935987342
                    ],
                    [
                        45,
                        0.20261253982999142
                    ],
                    [
                        46,
                        0.2525025749175691
                    ],
                    [
                        47,
                        0.1919838138801534
                    ],
                    [
                        48,
                        0.2237642254324774
                    ],
                    [
                        49,
                        0.8954615210445256
                    ],
                    [
                        50,
                        0.21569383388438204
                    ],
                    [
                        51,
                        0.25292917938187204
                    ],
                    [
                        52,
                        0.18617337102684944
                    ],
                    [
                        53,
                        0.3160900647394386
                    ],
                    [
                        54,
                        0.2680609756931389
                    ],
                    [
                        55,
                        0.24144654574042104
                    ],
                    [
                        56,
                        0.23266928031589745
                    ],
                    [
                        57,
                        0.2577763206892829
                    ],
                    [
                        58,
                        0.30941912624169654
                    ],
                    [
                        59,
                        0.19547719818035425
                    ],
                    [
                        60,
                        0.30711904793435013
                    ],
                    [
                        61,
                        0.2264804829563987
                    ],
                    [
                        62,
                        0.28329895336156125
                    ],
                    [
                        63,
                        0.3214140595924891
                    ],
                    [
                        64,
                        0.26030393268427854
                    ],
                    [
                        65,
                        0.24406387644333094
                    ],
                    [
                        66,
                        0.2977216840194436
                    ],
                    [
                        67,
                        0.2436042137926886
                    ],
                    [
                        68,
                        0.2622412786529045
                    ],
                    [
                        69,
                        0.23851984226089978
                    ],
                    [
                        70,
                        0.27073909845721367
                    ],
                    [
                        71,
                        0.31552506232532923
                    ],
                    [
                        72,
                        0.19708170663597466
                    ],
                    [
                        73,
                        0.2846976901323193
                    ],
                    [
                        74,
                        0.22364241680153957
                    ],
                    [
                        75,
                        0.142999404673292
                    ],
                    [
                        76,
                        0.24165586652636376
                    ],
                    [
                        77,
                        0.25338044029735807
                    ],
                    [
                        78,
                        0.3170882457799882
                    ],
                    [
                        79,
                        0.2513580899612191
                    ],
                    [
                        80,
                        0.1840614525316737
                    ],
                    [
                        81,
                        0.23971178564908827
                    ],
                    [
                        82,
                        0.22057066506701928
                    ],
                    [
                        83,
                        0.25893620099544645
                    ],
                    [
                        84,
                        0.3479576896107262
                    ],
                    [
                        85,
                        0.2874079355264716
                    ],
                    [
                        86,
                        0.31179415386833587
                    ],
                    [
                        87,
                        0.2170998923687883
                    ],
                    [
                        88,
                        0.26363924387550636
                    ],
                    [
                        89,
                        0.26309702148966946
                    ],
                    [
                        90,
                        0.2591620219979353
                    ],
                    [
                        91,
                        0.21396913512876595
                    ],
                    [
                        92,
                        0.17403929074649557
                    ],
                    [
                        93,
                        0.2916713524696034
                    ],
                    [
                        94,
                        0.25682259509355354
                    ],
                    [
                        95,
                        0.28962021092607815
                    ]
                ],
                "statistics": []
            }
        ]
        };
        return response.message;
    }

    getAnalytics(batteryId: string, startTime: string, endTime: string): Observable<any> {
        //const response =this.http.get<any>(`${this.EATRON_API_URL}/batteries/${batteryId}/faults`, {
        //});
        // return response.data.success ? response.data.message : {}
        const localhost_URL = "http://localhost:3000";
        return this.http.get<any>(`http://localhost:3000/analytics/?batteryId=VSTG4323PMC000011&startTime=2023-12-01 00:00:00&endTime=2023-12-03 00:00:00`);
    }
}