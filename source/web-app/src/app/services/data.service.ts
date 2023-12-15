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

    getFaults(batteryId: string): Observable<any> {
        return this.http.get<any>(`${this.EATRON_API_URL}/batteries/${batteryId}/faults`, {
            headers: new HttpHeaders({
                "Authorization": "Bearer " + localStorage.getItem("eatron_token"),
                "accept": "application/json"
            }),
        });
    }

    getAnalytics(batteryId: string, startTime: string, endTime: string) {
        //const response =this.http.get<any>(`${this.EATRON_API_URL}/batteries/${batteryId}/faults`, {
        //});
        // return response.data.success ? response.data.message : {}
        const localhost_URL = "http://localhost:3000"
        const result = this.http.get<any>(`${localhost_URL}/analytics/?batteryId=${batteryId}&startTime=${startTime}&endTime=${endTime}`);
        
        const response = {
          "success": true,
          "message": {
            "vehicle": [
              {
                "bucket": "2023-12-01T00:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.174465840657554,
                "lng": -115.15179389953613,
                "velocity": 27.45545358479023,
                "odom": 225726.515625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.144767112731934,
                "lng": -115.10092343648274,
                "velocity": 12.442250626881917,
                "odom": 234039.171875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.116026382446286,
                "lng": -115.06975723266602,
                "velocity": 0,
                "odom": 239062.40625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.08374786376953,
                "lng": -115.0354232788086,
                "velocity": 0,
                "odom": 239062.40625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.08374786376953,
                "lng": -115.0354232788086,
                "velocity": 0,
                "odom": 239062.40625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.08374786376953,
                "lng": -115.0354232788086,
                "velocity": 0,
                "odom": 239062.40625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.08374786376953,
                "lng": -115.0354232788086,
                "velocity": 0,
                "odom": 239062.40625,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:35:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.0837113571167,
                "lng": -115.0377882385254,
                "velocity": 8.963295697271825,
                "odom": 241775.171875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:40:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.09744239807129,
                "lng": -115.07558876037598,
                "velocity": 13.223511487742265,
                "odom": 245722.28125,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:45:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.1184827931722,
                "lng": -115.09544486999512,
                "velocity": 17.37452411731084,
                "odom": 250946,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:50:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12986080169678,
                "lng": -115.13139729817708,
                "velocity": 10.67811803430319,
                "odom": 254158.1875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T00:55:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.1280247370402,
                "lng": -115.15459518432617,
                "velocity": 3.574100716908773,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12794876098633,
                "lng": -115.15467071533206,
                "velocity": 0,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12794876098633,
                "lng": -115.15467071533206,
                "velocity": 0,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12794876098633,
                "lng": -115.15467071533206,
                "velocity": 0,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12794876098633,
                "lng": -115.15467071533206,
                "velocity": 0,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12794876098633,
                "lng": -115.15467071533206,
                "velocity": 0,
                "odom": 255226.546875,
                "ambient_air_temp": 9.999993896484323
              },
              {
                "bucket": "2023-12-01T01:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.13297826131185,
                "lng": -115.17878560384115,
                "velocity": 23.642581562399865,
                "odom": 262345.0625,
                "ambient_air_temp": 9.10332722981766
              },
              {
                "bucket": "2023-12-01T01:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.14422669728597,
                "lng": -115.24635915120443,
                "velocity": 24.027978173295658,
                "odom": 269562.46875,
                "ambient_air_temp": 8.999993896484328
              },
              {
                "bucket": "2023-12-01T01:35:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.14593580881755,
                "lng": -115.30718681335449,
                "velocity": 23.841182512640952,
                "odom": 276714.5,
                "ambient_air_temp": 8.999993896484328
              },
              {
                "bucket": "2023-12-01T01:40:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.1590310160319,
                "lng": -115.25142601013184,
                "velocity": 23.861109931667645,
                "odom": 283872.375,
                "ambient_air_temp": 8.999993896484328
              },
              {
                "bucket": "2023-12-01T01:45:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.15882715861002,
                "lng": -115.16927040100097,
                "velocity": 24.033630721767743,
                "odom": 291077.28125,
                "ambient_air_temp": 8.999993896484328
              },
              {
                "bucket": "2023-12-01T01:50:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.14187562306722,
                "lng": -115.09651117960613,
                "velocity": 24.25550631304582,
                "odom": 298356.40625,
                "ambient_air_temp": 8.999993896484328
              },
              {
                "bucket": "2023-12-01T01:55:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12921526590983,
                "lng": -115.04651842753093,
                "velocity": 16.53092373639345,
                "odom": 303334.0625,
                "ambient_air_temp": 6.899993896484332
              },
              {
                "bucket": "2023-12-01T02:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.129664459228515,
                "lng": -115.0787978363037,
                "velocity": 11.81132118155559,
                "odom": 306867.78125,
                "ambient_air_temp": 5.999993896484349
              },
              {
                "bucket": "2023-12-01T02:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.12984753926595,
                "lng": -115.11415575663248,
                "velocity": 13.058416028022766,
                "odom": 310790.9375,
                "ambient_air_temp": 5.999993896484349
              },
              {
                "bucket": "2023-12-01T02:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.1292423248291,
                "lng": -115.14877517700195,
                "velocity": 8.378222652375698,
                "odom": 313326.125,
                "ambient_air_temp": 6.769993896484349
              },
              {
                "bucket": "2023-12-01T02:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.16538088480632,
                "lng": -115.14583872477213,
                "velocity": 26.479296425183612,
                "odom": 321257.3125,
                "ambient_air_temp": 12.999993896484314
              },
              {
                "bucket": "2023-12-01T02:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.195845158894855,
                "lng": -115.08787582397461,
                "velocity": 27.007625401814778,
                "odom": 329366.21875,
                "ambient_air_temp": 12.999993896484314
              },
              {
                "bucket": "2023-12-01T02:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.196139132181806,
                "lng": -115.03681037902832,
                "velocity": 21.733884213765464,
                "odom": 335946.03125,
                "ambient_air_temp": 9.966660563150981
              },
              {
                "bucket": "2023-12-01T02:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "lat": 36.19587575912475,
                "lng": -115.10366668701172,
                "velocity": 24.56581500649452,
                "odom": 340842.21875,
                "ambient_air_temp": 7.999993896484357
              }
            ],
            "battery": [
              {
                "bucket": "2023-12-01T00:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -64.77102268894514,
                "state_of_charge": 1683.6597816160859,
                "state_of_health": 0.9904689317941666,
                "state_of_health_resistance": 100.38470149040222,
                "temp_average": 27.9261793751187,
                "capacity_throughput": 600,
                "charge_throughput": 21.04854393005371
              },
              {
                "bucket": "2023-12-01T00:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -33.55627352237701,
                "state_of_charge": 1252.1312081037074,
                "state_of_health": 0.9904666479428609,
                "state_of_health_resistance": 100.39774755636851,
                "temp_average": 32.14060574743482,
                "capacity_throughput": 600,
                "charge_throughput": 21.04854393005371
              },
              {
                "bucket": "2023-12-01T00:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 42,
                "state_of_charge": 1276.7410366588845,
                "state_of_health": 0.9904655263821284,
                "state_of_health_resistance": 100.39749197165172,
                "temp_average": 32.32117165777418,
                "capacity_throughput": 600,
                "charge_throughput": 21.082218176523845
              },
              {
                "bucket": "2023-12-01T00:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 99.53333333333333,
                "state_of_charge": 1968.8772139810828,
                "state_of_health": 0.9904160881042481,
                "state_of_health_resistance": 100.38001096248627,
                "temp_average": 34.98425442589651,
                "capacity_throughput": 600,
                "charge_throughput": 21.397574577331543
              },
              {
                "bucket": "2023-12-01T00:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 95,
                "state_of_charge": 2776.7841911764076,
                "state_of_health": 0.9903556215763092,
                "state_of_health_resistance": 100.35890658696492,
                "temp_average": 41.608851739035664,
                "capacity_throughput": 600,
                "charge_throughput": 21.765178972880047
              },
              {
                "bucket": "2023-12-01T00:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 95,
                "state_of_charge": 3568.4149343113254,
                "state_of_health": 0.9902957057952881,
                "state_of_health_resistance": 100.3374342918396,
                "temp_average": 49.25468048731479,
                "capacity_throughput": 600,
                "charge_throughput": 22.125027459462483
              },
              {
                "bucket": "2023-12-01T00:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 95,
                "state_of_charge": 4360.06461678137,
                "state_of_health": 0.9902364776531856,
                "state_of_health_resistance": 100.31514736016591,
                "temp_average": 55.22042838308532,
                "capacity_throughput": 600,
                "charge_throughput": 22.484875946044923
              },
              {
                "bucket": "2023-12-01T00:35:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 11.55596447388331,
                "state_of_charge": 4924.164763074917,
                "state_of_health": 0.9901769681771596,
                "state_of_health_resistance": 100.29948870340984,
                "temp_average": 25.705636528862907,
                "capacity_throughput": 600,
                "charge_throughput": 22.761935602823893
              },
              {
                "bucket": "2023-12-01T00:40:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -14.35161185870568,
                "state_of_charge": 4783.490185421378,
                "state_of_health": 0.9901638819773992,
                "state_of_health_resistance": 100.30451599756877,
                "temp_average": 10.293814791573451,
                "capacity_throughput": 600,
                "charge_throughput": 22.78055191040039
              },
              {
                "bucket": "2023-12-01T00:45:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -25.794734765291214,
                "state_of_charge": 4611.401860087104,
                "state_of_health": 0.9901610374450683,
                "state_of_health_resistance": 100.31016719341278,
                "temp_average": 10.66511943287323,
                "capacity_throughput": 600,
                "charge_throughput": 22.78055191040039
              },
              {
                "bucket": "2023-12-01T00:50:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -22.153902555604777,
                "state_of_charge": 4450.193540875581,
                "state_of_health": 0.9901586389541626,
                "state_of_health_resistance": 100.31546254952748,
                "temp_average": 11.000807873408034,
                "capacity_throughput": 600,
                "charge_throughput": 22.78055191040039
              },
              {
                "bucket": "2023-12-01T00:55:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 81.5342932353417,
                "state_of_charge": 4607.232994359825,
                "state_of_health": 0.9901350615421931,
                "state_of_health_resistance": 100.31131287415822,
                "temp_average": 12.706876956092032,
                "capacity_throughput": 600,
                "charge_throughput": 22.91578301111857
              },
              {
                "bucket": "2023-12-01T01:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 100,
                "state_of_charge": 5428.080206333198,
                "state_of_health": 0.9900750253597895,
                "state_of_health_resistance": 100.28665967782338,
                "temp_average": 17.80885348002121,
                "capacity_throughput": 600,
                "charge_throughput": 23.290021152496337
              },
              {
                "bucket": "2023-12-01T01:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 100,
                "state_of_charge": 6259.4657066406135,
                "state_of_health": 0.9900139359633128,
                "state_of_health_resistance": 100.26078120867412,
                "temp_average": 23.248398998048625,
                "capacity_throughput": 600,
                "charge_throughput": 23.668809032440187
              },
              {
                "bucket": "2023-12-01T01:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 96.26666666666667,
                "state_of_charge": 7079.995247715451,
                "state_of_health": 0.9899535663922627,
                "state_of_health_resistance": 100.23439081509908,
                "temp_average": 28.0309994750553,
                "capacity_throughput": 600,
                "charge_throughput": 24.04229384104411
              },
              {
                "bucket": "2023-12-01T01:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 82.5679330698649,
                "state_of_charge": 7849.804032277457,
                "state_of_health": 0.9898962676525116,
                "state_of_health_resistance": 100.2088756163915,
                "temp_average": 32.35873577435813,
                "capacity_throughput": 600,
                "charge_throughput": 24.392368329366047
              },
              {
                "bucket": "2023-12-01T01:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": 47.289496739705406,
                "state_of_charge": 8376.237900688,
                "state_of_health": 0.9898549894491832,
                "state_of_health_resistance": 100.19101599852245,
                "temp_average": 34.76316415786741,
                "capacity_throughput": 600,
                "charge_throughput": 24.63194934209188
              },
              {
                "bucket": "2023-12-01T01:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -41.84810482164224,
                "state_of_charge": 8423.952364809422,
                "state_of_health": 0.9896966628233592,
                "state_of_health_resistance": 100.1918541987737,
                "temp_average": 12.06543653382199,
                "capacity_throughput": 600,
                "charge_throughput": 24.727683963775636
              },
              {
                "bucket": "2023-12-01T01:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -45.34242861037453,
                "state_of_charge": 8069.4169472180465,
                "state_of_health": 0.9896701820691427,
                "state_of_health_resistance": 100.20474004745483,
                "temp_average": 12.426984235975512,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T01:35:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -42.47861223340035,
                "state_of_charge": 7704.6195939238,
                "state_of_health": 0.9896601394812266,
                "state_of_health_resistance": 100.2177227338155,
                "temp_average": 17.033156311247133,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T01:40:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -42.78487701271971,
                "state_of_charge": 7335.580110599037,
                "state_of_health": 0.989650486310323,
                "state_of_health_resistance": 100.23084990183513,
                "temp_average": 18.50413874732129,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T01:45:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -40.72225179627538,
                "state_of_charge": 6963.175360344744,
                "state_of_health": 0.9896411138772965,
                "state_of_health_resistance": 100.24409099419911,
                "temp_average": 19.810003389782416,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T01:50:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -46.2150328048567,
                "state_of_charge": 6587.70169010511,
                "state_of_health": 0.9896320865551631,
                "state_of_health_resistance": 100.25743905703227,
                "temp_average": 17.13141748216423,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T01:55:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -33.562881035208704,
                "state_of_charge": 6228.580058194699,
                "state_of_health": 0.9896217928330103,
                "state_of_health_resistance": 100.27081922690074,
                "temp_average": 9.415359925164145,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:00:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -19.35781756301721,
                "state_of_charge": 6025.739524849132,
                "state_of_health": 0.9896158075332642,
                "state_of_health_resistance": 100.27833406130473,
                "temp_average": 6.549498960706943,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:05:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -24.045219848155977,
                "state_of_charge": 5862.743522957403,
                "state_of_health": 0.9896115638812383,
                "state_of_health_resistance": 100.28417905171712,
                "temp_average": 6.9122118536631465,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:10:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -18.79661333342393,
                "state_of_charge": 5699.451811610651,
                "state_of_health": 0.9896005938450495,
                "state_of_health_resistance": 100.29080192248027,
                "temp_average": 7.9016215472751385,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:15:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -50.565008125007154,
                "state_of_charge": 5346.050484406162,
                "state_of_health": 0.9895368911822637,
                "state_of_health_resistance": 100.30961227416992,
                "temp_average": 14.335789559682247,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:20:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -54.32213385745883,
                "state_of_charge": 4931.059917903716,
                "state_of_health": 0.9895294620593389,
                "state_of_health_resistance": 100.32432607809703,
                "temp_average": 16.481911840438887,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:25:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -62.74047591408094,
                "state_of_charge": 4506.7557518650665,
                "state_of_health": 0.9896105529864629,
                "state_of_health_resistance": 100.34034430980682,
                "temp_average": 12.388503657447007,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              },
              {
                "bucket": "2023-12-01T02:30:00.000Z",
                "vehicle_id": "KMHGN4JE0FU093536",
                "battery_id": "VSTG4323PMC000011",
                "current": -45.46550545573235,
                "state_of_charge": 4040.467813693794,
                "state_of_health": 0.989659888446331,
                "state_of_health_resistance": 100.35748636722565,
                "temp_average": 10.970539388656636,
                "capacity_throughput": 600,
                "charge_throughput": 24.72837257385254
              }
            ],
            "cell": {
              "Cell10Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell11Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell12Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell13Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell14Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell15Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell16Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell17Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell18Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell19Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell1Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961106419563294
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1457356174786884
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2811965632438658
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6412789662679037
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831046940485636
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123933720588684
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709904527664185
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794014916419983
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931454515457154
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516600314776104
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647010882695516
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074419776598614
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962954059441884
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0276821454366045
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.1021313444773355
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016105651855
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756067911784
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.048077742258708
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9525262784957884
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9090242123603822
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879460124174754
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.853087952931722
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441814104716
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.792683363755544
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.803500450452169
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7804689478874205
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326446056366
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545329769452413
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5982800269126893
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.563550736904144
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5500407552719118
                }
              ],
              "Cell20Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell21Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell22Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell23Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell24Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell25Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell26Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell27Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell28Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell29Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell2Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961242008209227
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.14577623685201
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812557450930275
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413083283106484
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060391267141
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.912395648956299
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886940320333
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017170270284
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.693147377173106
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.651661853790283
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6470129068692527
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.807444388071696
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9629552666346233
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682599226634
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8794599477450054
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8114416488011678
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.792683242956797
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003876686098
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468892256419
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7693264881769815
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.654534225463867
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281660079956
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.563552216688792
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5500449085235597
                }
              ],
              "Cell30Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell31Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell32Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell33Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell34Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell35Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell36Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell37Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell38Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell39Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell3Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.196124459107717
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776940981547
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567671140034
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088417053223
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8310606249173484
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956775665283
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886495272317
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017252922058
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.693147447903951
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.651661911805471
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.64701296488444
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444540341696
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9629553087552387
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7693265310923256
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343001683555
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5982817157109577
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522484779356
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5500450134277344
                }
              ],
              "Cell40Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell41Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.127517920335134
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.0730057183901467
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.204270456631978
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5613487060864766
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.750974511305491
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.832308394908905
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7909308099746704
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.713997576236725
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.613154433568319
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5716759928067527
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5670246624946595
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7274097935358683
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8828973078727724
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.94762921333313
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.022081448237102
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.1069655529658
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.117717677752177
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.96808473110199
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8725509659449258
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8290498073895773
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.799482753276825
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.773107670148214
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7314646593729655
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7127036277453103
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.723512805302938
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7004826339085897
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6893383900324506
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.574568786621094
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5183209371566773
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.483591521581014
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.470077509880066
                }
              ],
              "Cell42Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell43Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell44Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell45Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell46Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell47Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell48Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell49Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell4Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell50Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell51Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell52Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell53Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell54Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell55Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell56Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell57Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell58Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell59Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell5Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell60Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell61Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell62Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell63Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell64Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell65Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell66Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell67Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell68Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell69Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell6Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell70Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell71Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell72Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                },
                {
                  "bucket": "2023-12-01T01:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.909024017651876
                },
                {
                  "bucket": "2023-12-01T01:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.879459948539734
                },
                {
                  "bucket": "2023-12-01T01:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8530878082911175
                },
                {
                  "bucket": "2023-12-01T01:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.811441652774811
                },
                {
                  "bucket": "2023-12-01T01:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.7926832461357116
                },
                {
                  "bucket": "2023-12-01T02:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8035003916422525
                },
                {
                  "bucket": "2023-12-01T02:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.780468898614248
                },
                {
                  "bucket": "2023-12-01T02:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.769326533476512
                },
                {
                  "bucket": "2023-12-01T02:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6545343017578125
                },
                {
                  "bucket": "2023-12-01T02:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.598281721274058
                },
                {
                  "bucket": "2023-12-01T02:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.5635522492726643
                },
                {
                  "bucket": "2023-12-01T02:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.550045018196106
                }
              ],
              "Cell73Volt": [
                {
                  "bucket": "2023-12-01T00:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.1961244614919027
                },
                {
                  "bucket": "2023-12-01T00:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.145776956876119
                },
                {
                  "bucket": "2023-12-01T00:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.2812567941347757
                },
                {
                  "bucket": "2023-12-01T00:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6413088480631512
                },
                {
                  "bucket": "2023-12-01T00:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.831060630480448
                },
                {
                  "bucket": "2023-12-01T00:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.9123956759770713
                },
                {
                  "bucket": "2023-12-01T00:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8709886479377746
                },
                {
                  "bucket": "2023-12-01T00:35:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.794017255306244
                },
                {
                  "bucket": "2023-12-01T00:40:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6931474502881367
                },
                {
                  "bucket": "2023-12-01T00:45:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.6516619126001992
                },
                {
                  "bucket": "2023-12-01T00:50:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.647012967268626
                },
                {
                  "bucket": "2023-12-01T00:55:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.8074444564183554
                },
                {
                  "bucket": "2023-12-01T01:00:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.962955310344696
                },
                {
                  "bucket": "2023-12-01T01:05:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.027682602405548
                },
                {
                  "bucket": "2023-12-01T01:10:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.102131741841634
                },
                {
                  "bucket": "2023-12-01T01:15:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.187016518910726
                },
                {
                  "bucket": "2023-12-01T01:20:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.197756373087565
                },
                {
                  "bucket": "2023-12-01T01:25:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 4.0480776850382485
                },
                {
                  "bucket": "2023-12-01T01:30:00.000Z",
                  "vehicle_id": "KMHGN4JE0FU093536",
                  "battery_id": "VSTG4323PMC000011",
                  "voltage": 3.952526083787282
                }
            ]}
          }
        }

      
        return response.message;
    }
}