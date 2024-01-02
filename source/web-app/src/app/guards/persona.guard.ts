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
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { UserPreferenceService } from "../services/user-preference.service";
import { UserPersona } from "../models/user-persona";

@Injectable({
  providedIn: "root",
})
export class PersonaGuard implements CanActivate {
  constructor(
    private userPrefService: UserPreferenceService,
    private router: Router
  ) {}
  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.userPrefService.currentPersona === UserPersona.FLEET_OPERATOR) {
      if (!this.router.url.includes("/dashboard")) {
        this.router.navigate(["/dashboard"]).then();
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
