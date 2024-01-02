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
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SpinnerComponent } from "./components/spinner/spinner.component";
import { HighchartsChartModule } from "highcharts-angular";
import { BreadcrumbComponent } from "./components/breadcrumb/breadcrumb.component";
import { SwitchComponent } from "./components/switch/switch.component";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    BreadcrumbComponent,
    SwitchComponent,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    FontAwesomeModule,
    SpinnerComponent,
    BreadcrumbComponent,
    SwitchComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HighchartsChartModule,
    RouterLink,
    RouterLinkActive,
  ],
})
export class SharedModule {}
