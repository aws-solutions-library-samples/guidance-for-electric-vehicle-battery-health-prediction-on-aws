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

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import * as Highcharts from "highcharts";

@Component({
  selector: "app-battery-charge",
  templateUrl: "./battery-charge.component.html",
  styleUrls: ["./battery-charge.component.scss"],
})
export class BatteryChargeComponent implements OnChanges, OnInit {
  highcharts = Highcharts;
  chartOptions: any;

  @Input() metric: any;
  @Input() mValue: any;
  @Input() overrideCss: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes &&
      changes["mValue"].currentValue &&
      changes["mValue"].currentValue !== changes["mValue"].previousValue
    ) {
      this.setBatteryCellHealth();
    }
  }

  ngOnInit(): void {
    this.setBatteryCellHealth();
  }

  setBatteryCellHealth() {
    setTimeout(() => {
      const battery: any = document.querySelector(`.battery.${this.metric}`);
      if (battery) {
        battery?.style.setProperty("--width", `${this.mValue}%`);
        battery?.style.setProperty("--animation", "none");
        if (this.mValue > 80) {
          battery?.style.setProperty("--background", "#1D8102");
        } else if (this.mValue <= 80 && this.mValue >= 60) {
          battery?.style.setProperty("--background", "#fcd303");
        } else if (this.mValue <= 60 && this.mValue >= 40) {
          battery?.style.setProperty("--background", "#fcb503");
        } else if (this.mValue <= 40 && this.mValue >= 20) {
          battery?.style.setProperty("--background", "#ff9606");
        } else if (this.mValue < 20) {
          battery?.style.setProperty("--background", "red");
        }
      }
    }, 2000);
  }

  getOverrideClass() {
    return this.overrideCss;
  }
}
