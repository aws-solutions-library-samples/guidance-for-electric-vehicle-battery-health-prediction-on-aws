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

import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { Hub } from 'aws-amplify';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private titleService: Title, private authService: AuthService, private router: Router) {
    this.titleService.setTitle(environment.NG_APP_NAME as any);
    Hub.listen('auth', (data) => {
        switch (data.payload.event) {
          case 'signIn':
              console.log('user signed in');
              this.authService.setCurrentSession();
              this.router.navigate(['/dashboard']).then();
              break;
          case 'signUp':
              console.log('user signed up');
              break;
          case 'signOut':
              console.log('user signed out');
              break;
          case 'signIn_failure':
              console.log('user sign in failed');
              break;
          case 'configured':
              console.log('the Auth module is configured');
        }
      });
  }
}
