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

import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../services/auth.service";
import { Auth } from "aws-amplify";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UserPreferenceService } from "../../../../services/user-preference.service";
import { Router } from "@angular/router";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userName = "";
  faUser = faUser;
  showLogout = false;
  showSpinner = false;
  logoSrc = environment.NG_APP_LOGO;
  customerName = environment.NG_APP_NAME;

  toggleMenu = () => {
    this.showLogout = false;
    this.removeClickEvent();
  };
  toggleMenuBind = this.toggleMenu.bind(this);

  constructor(
    private authService: AuthService,
    public userPrefService: UserPreferenceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getLoginStatus().then(async (status) => {
      this.isLoggedIn = status;
      if (this.isLoggedIn) {
        const userInfo = await Auth.currentUserInfo();
        this.userName = userInfo.username;
      }
    });
  }

  signOut() {
    this.showSpinner = true;
    this.authService.logout();
  }

  switchProfile() {
    if (this.userPrefService.currentPersona === 1)
      this.userPrefService.currentPersona = 2;
    else this.userPrefService.currentPersona = 1;
    this.showLogout = false;
    if (!this.router.url.includes("/dashboard")) {
      this.router.navigate(["/dashboard"]);
    }
  }

  navHandler() {
    this.showLogout = !this.showLogout;
    if (this.showLogout) {
      setTimeout(() => {
        window.addEventListener("click", this.toggleMenuBind);
      });
    }
  }

  private removeClickEvent() {
    window.removeEventListener("click", this.toggleMenuBind);
  }
}
