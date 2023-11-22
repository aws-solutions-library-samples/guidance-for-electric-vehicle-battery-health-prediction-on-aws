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

import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnChanges {

  @Input() metric: any;
  @Input() mValue: any;

  ngOnChanges(changes: SimpleChanges): void {
      if (changes && changes['mValue'].currentValue !== changes['mValue'].previousValue) {
          this.setAnimation();
      }
  }

    setAnimation() {
      const metricLine: any = document.querySelector(`.metric-bar-line.${this.metric}`);
        if (metricLine) {
            metricLine?.style.setProperty('--left', `${this.mValue}%`);
            metricLine?.style.setProperty('--animation', 'none');
        }
    }
}
