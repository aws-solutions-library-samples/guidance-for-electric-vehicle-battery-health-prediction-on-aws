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

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

type ClickHandler = () => void;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  @Input() text: string | undefined;
  @Input() route: any;
  @Input() clickHandler: ClickHandler | undefined
  constructor(private router: Router) { }

  navigate() {
    if (this.route) {
      this.router.navigateByUrl(this.route).then();
    } else if (this.clickHandler) {
      this.clickHandler();
    }
  }

}
