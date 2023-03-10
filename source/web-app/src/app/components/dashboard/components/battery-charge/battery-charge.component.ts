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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
    selector: 'app-battery-charge',
    templateUrl: './battery-charge.component.html',
    styleUrls: ['./battery-charge.component.scss']
})
export class BatteryChargeComponent implements OnChanges, OnInit {

    highcharts = Highcharts;
    chartOptions: any;

    @Input() metric: any;
    @Input() mValue: any;
    @Input() overrideCss: any;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes['mValue'].currentValue && changes['mValue'].currentValue !== changes['mValue'].previousValue) {
            const battery: any = document.querySelector(`.battery.${this.metric}`);
            if (battery) {
                battery?.style.setProperty('--width', `${this.mValue}%`);
                battery?.style.setProperty('--animation', 'none');
                this.setBatteryCellHealth(battery, this.mValue);
            }
        }
    }

    ngOnInit(): void {
        const battery: any = document.querySelector(`.battery.${this.metric}`);
            if (battery) {
                battery?.style.setProperty('--width', `${this.mValue}%`);
                battery?.style.setProperty('--animation', 'none');
                this.setBatteryCellHealth(battery, this.mValue);
            }
    }
    setBatteryCellHealth(battery: any, value: number) {
        if (value <= 80 && value >= 60) {
            battery?.style.setProperty('--background', '#fcd303');
        } else if (value <= 60 && value >= 40) {
            battery?.style.setProperty('--background', '#fcb503');
        } else if (value <= 40 && value >= 20) {
            battery?.style.setProperty('--background', '#ff9606');
        } else if (value < 20) {
            battery?.style.setProperty('--background', 'red');
        }
    }


    getOverrideClass() {
        return this.overrideCss;
    }
}
