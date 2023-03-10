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

import {Component, OnInit} from '@angular/core';
import {APIService, GetPipelineByIdQuery, GetPipelinesByUserQuery} from "../../services/api.service";
import {DataService} from "../../services/data.service";
// @ts-ignore
import * as Highcharts from 'highcharts';
import {faCirclePause, faCirclePlay} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import AnnotationsModule from 'highcharts/modules/annotations';
import SolidGauge from 'highcharts/modules/solid-gauge';
import HC_more from "highcharts/highcharts-more";
import {Auth} from "aws-amplify";

AnnotationsModule(Highcharts);
HC_more(Highcharts);
SolidGauge(Highcharts);

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    pipelineId: any;
    pipelineData: GetPipelineByIdQuery | undefined;
    showSpinner = true;
    startedStream: any;
    batteryMetadata: any;
    batteries: string[] = [];
    modules: string[] = [];
    battery: any;
    popout = false;
    selectedBattery: any;
    highcharts = Highcharts;
    linechartDark: any;
    currentSOH = 0;
    forecastedRUL = 0;
    forecastedSOH = 0;
    forecastedStateOfCharge = 0;
    lastChargingCycle = 1;
    faPlay = faCirclePlay;
    faPause = faCirclePause;
    username: any;
    drift = 0;
    private streamingInterval: any;
    private sohData: any[] = [];
    private futureSOHData: any[] = [];
    private forecastSOHData: any[] = [];
    private streamingData: any[] = [];
    private annotationStart: number | any;
    private chartRef: any;
    chargingChartOptions: any = {
        chart: {
            type: 'pie',
            backgroundColor: '#1B1E20',
            height: '120%',
        },
        title: {
            text: `
                <div class="pop-in-out-icon-container">
                    <h3>State of Health</h3>
                    <img id="popout-icon" src="/assets/icons/popout.png" alt="Popout Icon">
                    <img id="popin-icon" src="/assets/icons/popin.png" alt="Restore Icon">
                </div>
            `,
            align: 'center',
            verticalAlign: 'middle',
            floating: true,
            useHTML: true
        },
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false,
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                dataLabels: {
                    enabled: false,
                },
                innerSize: '85%',
                borderWidth: 0,
                colors: ['#1D8102', '#2D343D']
            }
        },
        series: [{}]
    };
    gaugeOptions: any = {
        chart: {
            type: 'gauge',
            backgroundColor: '#1B1E20',
        },
        title: {
            text: undefined
        },
        pane: {
            center: ['50%', '85%'],
            startAngle: -90,
            endAngle: 90,
            background: false,
            size: '100%'
        },
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        yAxis: {
            tickPixelInterval: 72,
            tickLength: 20,
            tickWidth: 0,
            minorTickInterval: null,
            labels: {
                enabled: false
            },
            lineWidth: 0,
        },
        plotOptions: {
            gauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        },
        series: [{
            dial: {
                backgroundColor: 'transparent',
            },
            pivot: {
                backgroundColor: 'transparent',
            }
        }],
    };
    displayText = 'Loading Map...';

    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chartRef = chart;
        this.clickHandler();
    };
    chargingChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: {
                text: `
                <div class="battery-charge-info">
                    <h6>Charging</h6>
                    <span>
                        <img src="/assets/images/battery-charging.png" alt="Battery charging">
                        <span>${this.battery?.chargingDetails?.currentCharge}%</span>
                    </span>
                </div>`
            },
            series: [{
                name: 'battery Charge',
                data: [this.battery?.chargingDetails?.currentCharge, 100 - this.battery?.chargingDetails?.currentCharge]
            }]
        });
    };
    fastChargeChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: {text: `<div class="battery-charge-info"><h6>Fast Charge</h6><span>${this.battery?.chargingDetails?.numberOfFastCharges}</span></div>`},
            series: [{data: [this.battery?.chargingDetails?.numberOfFastCharges, this.battery?.chargingDetails?.totalFastCharges - this.battery?.chargingDetails?.numberOfFastCharges]}]
        });
    };
    l1ChargeChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: {text: `<div class="battery-charge-info"><h6>Number of L1</h6><span>${this.battery?.chargingDetails?.numberOfL1}</span></div>`},
            series: [{data: [this.battery?.chargingDetails?.numberOfL1, this.battery?.chargingDetails?.totalNumberOfL1 - this.battery?.chargingDetails?.numberOfL1]}]
        });
    };
    l2ChargeChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: {text: `<div class="battery-charge-info"><h6>Number of L2</h6><span>${this.battery?.chargingDetails?.numberOfL2}</span></div>`},
            series: [{data: [this.battery?.chargingDetails?.numberOfL2, this.battery?.chargingDetails?.totalNumberOfL2 - this.battery?.chargingDetails?.numberOfL2]}]
        });
    };
    chargeCycleChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: {
                text: `<div class="battery-charge-info"><h6>Charge Cycle</h6><span>${this.battery?.chargingDetails?.chargeCycles}</span></div>`
            },
            series: [{data: [this.battery?.chargingDetails?.chargeCycles, this.battery?.expectedEOL]}]
        });
    };
    temperatureChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        const temp = this.battery.temperature;
        chart.update({
            yAxis: {
                min: this.battery.faultThresholds.temperatureMin,
                max: this.battery.faultThresholds.temperatureMax,
                plotBands: [{
                    from: 0,
                    to: 50,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: 50,
                    to: 100,
                    color: 'rgba(0, 136, 0, 1)',
                    thickness: 15
                }, {
                    from: 99,
                    to: 150,
                    color: 'rgba(0, 136, 0, 1)',
                    thickness: 15
                }, {
                    from: 150,
                    to: 200,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: this.battery.temperature,
                    to: this.battery.temperature + 1,
                    color: '#fff',
                    thickness: '35%',
                    outerRadius: '105%'
                }],
            },
            series: [{
                data: [temp],
                dataLabels: {
                    format: `
                    <div style="text-align:center; color: #fff;">
                       <h4 style="font-size:18px; margin: 1.5em 0 1em 0;">{y}<span style="font-size:12px;">°F</span></h4>
                        <h6 style="font-size:10px; margin: 0">Temp</h6>
                    </div>`
                },
            }]
        });
    };
    voltageChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        const voltage = this.battery.voltage;
        chart.update({
            yAxis: {
                min: this.battery.faultThresholds.voltageMin,
                max: this.battery.faultThresholds.voltageMax,
                plotBands: [{
                    from: 0,
                    to: 50,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: 50,
                    to: 100,
                    color: 'rgba(0, 136, 0, 1)',
                    thickness: 15
                }, {
                    from: 100,
                    to: 150,
                    color: 'rgba(0, 136, 0, 1)',
                    thickness: 15
                }, {
                    from: 150,
                    to: 200,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: voltage,
                    to: voltage + 1,
                    color: '#fff',
                    thickness: '35%',
                    outerRadius: '105%'
                }],
            },
            series: [{
                data: [voltage],
                dataLabels: {
                    format: `<div style="text-align:center; color: #fff;">
                        <h4 style="font-size:18px; margin: 1.5em 0 1em 0;">{y}<span style="font-size:12px;">&nbsp;V</span></h4>
                        <h6 style="font-size:10px; margin: 0">Voltage</h6>
                     </div>`
                },
            }]
        });
    };
    currentChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        const current = this.battery.current;
        chart.update({
            yAxis: {
                min: this.battery.faultThresholds.currentMin,
                max: this.battery.faultThresholds.currentMax,
                plotBands: [{
                    from: 0,
                    to: 2.5,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: 2.5,
                    to: 7.5,
                    color: 'rgba(0, 136, 0, 1)',
                    thickness: 15
                }, {
                    from: 7.5,
                    to: 10,
                    color: 'rgba(247, 0, 0, 1)',
                    thickness: 15
                }, {
                    from: current,
                    to: current + 0.1,
                    color: '#fff',
                    thickness: '35%',
                    outerRadius: '105%'
                }],
            },
            series: [{
                data: [current],
                dataLabels: {
                    format: `
                    <div style="text-align:center; color: #fff;">
                        <h4 style="font-size:18px; margin: 1.5em 0 1em 0;">{y}<span style="font-size:12px;"> A</span></h4>
                        <h6 style="font-size:10px; margin: 0">Current</h6>
                    </div>`
                },
            }]
        });
    };

    constructor(private apiService: APIService,
                private dataService: DataService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.uuid) {
                this.pipelineId = params.uuid;
            }
        });
    }

    ngOnInit(): void {
        Auth.currentUserInfo().then(user => {
            this.username = user.username.split('@')[0];
            if (!this.pipelineId) {
                this.apiService.GetPipelinesByUser(this.username).then((pipelines: GetPipelinesByUserQuery[]) => {
                    this.pipelineData = pipelines.filter((pipeline: GetPipelinesByUserQuery) => pipeline.PipelineStatus === 'PIPELINE_FINISHED')
                        .sort((pipeline1: GetPipelinesByUserQuery, pipeline2: GetPipelinesByUserQuery) => new Date(pipeline1.StatusUpdatedAt).getTime() - new Date(pipeline2.StatusUpdatedAt).getTime())
                        .pop();
                    if (this.pipelineData) {
                        this.pipelineId = this.pipelineData.Id;
                        this.dataService.getMetadata(this.username, this.pipelineId).subscribe((metadata: any) => {
                            this.batteryMetadata = JSON.parse(metadata);
                            this.batteries = Object.keys(this.batteryMetadata);
                        });
                    } else {
                        this.router.navigate(['/history']).then();
                    }
                });
            } else {
                this.dataService.getMetadata(this.username, this.pipelineId).subscribe((metadata: any) => {
                    this.batteryMetadata = JSON.parse(metadata);
                    this.batteries = Object.keys(this.batteryMetadata);
                });
            }
        });
    }

    startStreaming() {
        this.startedStream = !this.startedStream;
        if (this.startedStream) {
            this.streamingInterval = setInterval(() => {
                this.forecastSOHData.push(this.streamingData.shift());
                this.chartRef.series[2].addPoint(this.forecastSOHData[this.forecastSOHData.length - 1]);
                if (this.streamingData.length) {
                    setTimeout(() => {
                        this.annotationStart += 1;
                        this.chartRef.removeAnnotation('annotation');
                        this.chartRef.addAnnotation({
                            shapes: [{
                                type: 'path',
                                points: [{
                                    x: this.annotationStart,
                                    y: 100,
                                    xAxis: 0,
                                    yAxis: 0
                                }, {
                                    x: this.annotationStart,
                                    y: 0,
                                    xAxis: 0,
                                    yAxis: 0
                                },],
                            }],
                            id: 'annotation',
                            shapeOptions: {
                                dashStyle: 'Dash',
                                stroke: '#fff',
                                strokeWidth: 1
                            },
                        } as any);
                    }, 500);
                }
                if (!this.streamingData.length) {
                    this.stopStreaming();
                }
            }, 500);
        } else {
            this.stopStreaming();
        }
    }

    stopStreaming() {
        this.startedStream = false;
        clearInterval(this.streamingInterval);
    }

    resetBatteryInfo() {
        this.linechartDark = null;
        this.forecastSOHData = [];
        this.forecastedSOH = 0;
        this.forecastedRUL = 0;
        this.forecastedStateOfCharge = 0;
        this.stopStreaming();
    }

    updateBatteryData(batteryInfo: any) {
        this.displayText = 'Loading Dashboard...';
        this.showSpinner = true;
        this.selectedBattery = batteryInfo.BatteryId;
        this.battery = this.batteryMetadata[this.selectedBattery];
        this.modules = new Array(this.battery.numberOfModules);
        this.resetBatteryInfo();
        const observables = [
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'past'),
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'predictions'),
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'actual')
        ];
        forkJoin(observables).subscribe((responses: any[]) => {
            this.sohData = responses[0].map((charge: any) => +charge.soh);
            this.lastChargingCycle = this.sohData.length - 50;
            this.futureSOHData = [this.sohData[this.sohData.length - 1], ...(responses[1] ? responses[1].map((charge: any) => +charge.soh) : [])];
            this.streamingData = [this.sohData[this.sohData.length - 1], ...(responses[2] ? responses[2].map((charge: any) => +charge.soh) : [])];
            this.annotationStart = this.sohData.length - 1;
            this.setChartOption();
            this.popIn();
            const rulList = responses[0].map((charge: any) => +charge.rul);
            this.forecastedSOH = Math.floor(this.futureSOHData[this.futureSOHData.length - 1]);
            this.forecastedRUL = Math.floor(rulList[rulList.length - 1]);
            this.forecastedStateOfCharge = this.battery.stateOfCharge;
            const predicted = this.futureSOHData[this.futureSOHData.length - 1];
            const actual = this.streamingData[this.streamingData.length - 1]
            this.drift = (predicted - actual)*100/actual;
            this.showSpinner = false;
        });
        this.linechartDark = null;
        this.forecastSOHData = [];
        this.stopStreaming();
    }

    private setChartOption() {
        this.linechartDark = {
            series: [
                {
                    pointStart: this.sohData.length - 1,
                    data: this.futureSOHData,
                    color: '#38EF7D',
                    name: 'Predicted',
                },
                {
                    data: this.sohData,
                    color: '#FF9900',
                    name: 'Past'
                },
                {
                    pointStart: this.sohData.length - 1,
                    data: this.forecastSOHData,
                    color: '#DF2A5D',
                    name: 'Actual',
                },
            ],
            chart: {
                type: 'line',
                backgroundColor: '#2D343D',
                zoomType: 'xy',
                panning: true,
                panKey: 'shift',
                reflow: false,
            },
            annotations: [{
                id: 'annotation',
                shapeOptions: {
                    dashStyle: 'Dash',
                    stroke: '#fff',
                    strokeWidth: 1
                },
                shapes: [{
                    type: 'path',
                    points: [{
                        x: this.annotationStart,
                        y: 0,
                        xAxis: 0,
                        yAxis: 0
                    }, {
                        x: this.annotationStart,
                        y: 100,
                        xAxis: 0,
                        yAxis: 0
                    }],
                }],
            }],
            colorAxis: [{
                gridLineColor: '#e6e6e6'
            }],
            title: {
                text: '',
                style: {
                    fontSize: 24,
                    textAlign: 'left',
                    color: 'white',
                },
                useHTML: true,
                align: 'left',
            },
            credits: {
                enabled: false
            },
            yAxis: {
                labels: {
                    style: {
                        color: '#fff'
                    },
                },
                title: {
                    text: 'State of Health (%)',
                    style: {
                        color: '#fff'
                    }
                },
                gridLineColor: '#888',
                gridLineWidth: 1,
                min: this.getMinYAxis(),
                tickPixelInterval: 40
            },
            xAxis: {
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                title: {
                    text: 'Charging Cycle',
                    style: {
                        color: '#fff'
                    }
                },
                plotOptions: {
                    line: {
                        pointStart: this.lastChargingCycle,
                    }
                },
                min: this.getStartPoint(),
                max: this.sohData.length + 30,
                startOnTick: false,
                endOnTick: false,
                tickInterval: 1
            },
            legend: {
                enabled: true,
                align: 'left',
                verticalAlign: 'top',
                itemStyle: {
                    color: '#fff',
                    fontWeight: 300
                }
            },
            tooltip: {
                backgroundColor: '#2D343D',
                style: {color: '#fff'},
                //@ts-ignore
                formatter: function () {
                    // @ts-ignore
                    const x: any = this.x;
                    // @ts-ignore
                    const y: any = this.y;
                    if (x && y) {
                        return `<div><strong>Charging Cycle: </strong>${x}</div><div><strong>SOH:</strong> ${y}%</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        };
    }

    private getMinYAxis() {
        return Math.min(...this.sohData, ...this.futureSOHData, ...this.streamingData) - 2;
    }

    reset() {
        return () => {
            this.selectedBattery = null;
        }
    }

    popOut() {
        this.popout = true;
        this.chartRef.setSize(window.innerWidth - 100, window.innerHeight - 200);
        this.chartRef.update({
            title: {
                text: `
                    <div class="pop-in-out-icon-container">
                        <h3>State of Health</h3>
                        <img id="popin-icon" src="/assets/icons/popin.png" alt="Restore Icon">
                        <img id="popout-icon" src="/assets/icons/popout.png" alt="Popout Icon">
                    </div>
                `,
            },
            yAxis: {
                tickPixelInterval: 80
            }
        });
        this.clickHandler();
    }

    popIn() {
        this.popout = false;
        setTimeout(() => {
            const width = Math.ceil(window.innerWidth - ((window.innerWidth * 75) / 100));
            this.chartRef.setSize(width, 400);
            this.chartRef.update({
                title: {
                    text: `
                    <div class="pop-in-out-icon-container">
                        <h3>State of Health</h3>
                        <img id="popout-icon" src="/assets/icons/popout.png" alt="Popout Icon">
                        <img id="popin-icon" src="/assets/icons/popin.png" alt="Restore Icon">
                    </div>
                `,
                }
            });
            this.clickHandler();
        });
    }

    private getStartPoint() {
        return this.lastChargingCycle;
    }

    private clickHandler() {
        const popoutIcon = document.getElementById('popout-icon');
        const popinIcon = document.getElementById('popin-icon');
        if (popoutIcon) {
            popoutIcon.addEventListener('click', this.popOut.bind(this));
        }
        if (popinIcon) {
            popinIcon.addEventListener('click', this.popIn.bind(this));
        }
    }
}
