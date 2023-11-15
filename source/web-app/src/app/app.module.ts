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

import {APP_INITIALIZER, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AmplifyAuthenticatorModule} from "@aws-amplify/ui-angular";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./interceptor/auth.interceptor";
import {ConfigService} from "./services/config.service";
import {environment} from "../environments/environment";
import {Amplify} from "aws-amplify";
import {map} from "rxjs";
import {AuthService} from "./services/auth.service";
import {SharedModule} from "./modules/shared/shared.module";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HighchartsChartModule} from "highcharts-angular";
import {LoginComponent} from "./components/login/login.component";
import {PipelineComponent} from "./components/pipeline/pipeline.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TrackerComponent} from './components/tracker/tracker.component';
import {IndicatorComponent} from './components/dashboard/components/indicator/indicator.component';
import {MatSelectModule} from "@angular/material/select";
import {HistoryComponent} from './components/history/history.component';
import {MatTableModule} from "@angular/material/table";
import {BatteryChargeComponent} from './components/dashboard/components/battery-charge/battery-charge.component';
import {MapComponent} from './components/map/map.component';
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { DatasetSelectionComponent } from './components/pipeline/components/dataset-selection/dataset-selection.component';
import { TabsComponent } from './components/pipeline/components/tabs/tabs.component';
import { PluginSelectionComponent } from './components/pipeline/components/plugin-selection/plugin-selection.component';
import { BatteryInfoComponent } from './components/dashboard/components/battery-info/battery-info.component';

function getMapInfo(config: any) {
    const geo: any = {
            AmazonLocationService: {
              maps: {
                items: {
                },
                default: config.mapName,
              },
              region: config.region,
            },
          };
    geo.AmazonLocationService.maps.items[config.mapName] = {
        style: 'VectorEsriNavigation',
    }
    return geo;
}

function appInitializer(metadataService: ConfigService, authService: AuthService): any {
    return () => {
        return metadataService.getConfig().pipe(
            map((config: any) => {
                environment["NG_APP_REGION"] = config.region;
                environment["NG_APP_USER_POOL_ID"] = config.userPoolId;
                environment["NG_APP_IDENTITY_POOL_ID"] = config.identityPoolId;
                environment["NG_APP_APP_CLIENT_ID"] = config.appClientId;
                environment["NG_APP_DATASET_URI"] = config.bucketUrl + "/cdk-assets/raw_dataset.csv",
                environment["NG_APP_PLUGIN_URI"] = config.bucketUrl + "/cdk-assets/processing_plugin.py";

                // Amplify.Logger.LOG_LEVEL = "DEBUG";
                Amplify.configure({
                    Auth: {
                        mandatorySignIn: true,
                        region: environment.NG_APP_REGION,
                        userPoolId: environment.NG_APP_USER_POOL_ID,
                        identityPoolId: environment.NG_APP_IDENTITY_POOL_ID,
                        userPoolWebClientId: environment.NG_APP_APP_CLIENT_ID,
                    },
                    aws_appsync_graphqlEndpoint: config.graphqlEndpoint,
                    aws_appsync_region: config.region,
                    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
                    aws_appsync_apiKey: config.graphqlApiKey,
                    Storage: {
                        AWSS3: {
                            bucket: config.libraryBucket,
                            region: config.region,
                            customPrefix: {
                                public: ''
                            }
                        }
                    },
                    geo: getMapInfo(config)
                });
                // Set session when user is logged in but refreshed the page
                authService.setCurrentSession();
            })
        );
    };
}

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        PipelineComponent,
        DashboardComponent,
        TrackerComponent,
        IndicatorComponent,
        HistoryComponent,
        BatteryChargeComponent,
        MapComponent,
        DatasetSelectionComponent,
        TabsComponent,
        PluginSelectionComponent,
        BatteryInfoComponent
    ],
    imports: [
        BrowserModule,
        SharedModule,
        HttpClientModule,
        FormsModule,
        AmplifyAuthenticatorModule,
        BrowserAnimationsModule,
        HighchartsChartModule,
        MatSelectModule,
        AppRoutingModule,
        MatTableModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatPaginatorModule,
        MatCheckboxModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [ConfigService, AuthService],
        },
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
