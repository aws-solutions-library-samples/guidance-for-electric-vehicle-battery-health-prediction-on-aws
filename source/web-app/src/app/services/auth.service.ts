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
import {Injectable} from "@angular/core";
import {Auth} from "aws-amplify";
import {Router} from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    isLoggedIn = false;
    currentSession: any;

    constructor(private router: Router) {}

    async getLoginStatus() {
        const currentSession = await Auth.currentSession();
        return (this.isLoggedIn = currentSession.isValid());
    }

    logout() {
        Auth.signOut().then(() => {
            this.router.navigate(["/login"]).then();
        });
    }

    getToken() {
        return this.currentSession?.idToken?.jwtToken;
    }

    setCurrentSession() {
        Auth.currentSession().then((session) => {
            this.isLoggedIn = true;
            this.currentSession = session;
            console.log('Successfully set the session');
        }, () => console.log('User needs to log in'));
    }
}
