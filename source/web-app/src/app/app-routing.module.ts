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
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PipelineComponent } from "./components/pipeline/pipeline.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { LoginComponent } from "./components/login/login.component";
import { TrackerComponent } from "./components/tracker/tracker.component";
import { HistoryComponent } from "./components/history/history.component";
import { PersonaGuard } from "./guards/persona.guard";
import { AnalyticsComponent } from "./components/dashboard/components/analytics/analytics.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
    pathMatch: "full",
  },
  {
    path: "pipeline",
    component: PipelineComponent,
    pathMatch: "full",
    canActivate: [AuthGuard, PersonaGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: "tracker/:id",
    component: TrackerComponent,
    pathMatch: "full",
    canActivate: [AuthGuard, PersonaGuard],
  },
  {
    path: "history",
    component: HistoryComponent,
    pathMatch: "full",
    canActivate: [AuthGuard, PersonaGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
