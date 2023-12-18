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

import { Component, OnInit } from '@angular/core';
import { APIService, GetPipelineByIdQuery, GetPipelinesByUserQuery, PipelineData } from "../../services/api.service";
import { DataService } from "../../services/data.service";
// @ts-ignore
import * as Highcharts from 'highcharts';
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import AnnotationsModule from 'highcharts/modules/annotations';
import SolidGauge from 'highcharts/modules/solid-gauge';
import HC_more from "highcharts/highcharts-more";
import { Auth } from "aws-amplify";

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
    showSpinner = false;
    startedStream: any;
    batteryMetadata: any;
    batteries: string[] = [];
    modules: string[] = [];
    battery: any;
    popout = false;
    selectedBattery: any;
    highcharts = Highcharts;
    linechartDark: any;
    forecastedRUL = 0;
    forecastedSOH = 0;
    forecastedStateOfCharge = 0;
    lastChargingCycle = 1;
    username: any;
    drift = 0;
    moduleId: any;
    dtc_message: string = "";
    private streamingInterval: any;
    private sohData: any[] = [];
    private futureSOHData: any[] = [];
    private forecastSOHData: any[] = [];
    private streamingData: any[] = [];
    private annotationStart: number | any;
    private chartRef: any;
    private retrainSubscription: any;
    chargingChartOptions: any = {
        chart: {
            type: 'pie',
            backgroundColor: '#1B1E20',
            height: '110%',
        },
        title: {
            text: "",
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
                innerSize: '90%',
                borderWidth: 0,
                colors: ['#2D6ACA', '#58A0FA', '#E5F2EF', '#EBE3A4']
            }
        },
        series: [{}]
    };
    displayText = 'Loading Map...';
    showDrift = false;
    retrain = false;
    snoozedRetrain = false;
    showRetrainMessage = false;
    showPipelineStatus = false;
    showError = false;
    showFaultDetectionDetails = false;
    faultDetectionTitle = ""
    batteryVoltages: number[] = [];
    batteryTemperature: number[] = [];
    faultHistory: any[any] = []
    faultData: any = {};
    currentFaultData: any = {};
    faultLineChartOptions: any = {};
    faultStatistics: any = {};
    faultDetections = {
        "AcceleratedAging": {
            "title": "Accelerated Aging",
            "state": "green",
            "value": 10
        },
        "ExternalShortCircuit": {
            "title": "External Short Circuit",
            "state": "green",
            "value": 10
        },
        "OverTemp": {
            "title": "Over Temp",
            "state": "green",
            "value": 10
        },
        "Overvoltage": {
            "title": "Over Voltage",
            "state": "green",
            "value": 30
        },
        "VoltageDraft": {
            "title": "Voltage Draft",
            "state": "green",
            "value": 30
        },
        "DeepTempCharge": {
            "title": "Deep Temp Charge",
            "state": "green",
            "value": 30
        },
        "Internal Short Circuit": {
            "title": "Internal Short Circuit",
            "state": "green",
            "value": 30
        },
        "DeepDischarge": {
            "title": "Deep Discharge",
            "state": "green",
            "value": 30
        },
        "Overcurrent": {
            "title": "Over Current",
            "state": "green",
            "value": 30
        },
        "Lithium Plating": {
            "title": "Lithium Plating",
            "state": "green",
            "value": 30         
        },
        "Thermal Runaway": {
            "title": "Thermal Runaway",
            "state": "green",
            "value": 30         
        }
    };
    initialFaultDetections = {
        "AcceleratedAging": {
            "title": "Accelerated Aging",
            "state": "green",
            "value": 10
        },
        "ThermalEnergy": {
            "title": "Thermal Energy",
            "state": "green",
            "value": 10
        },
        "ExternalShortCircuit": {
            "title": "External Short Circuit",
            "state": "green",
            "value": 10
        },
        "OverTemp": {
            "title": "Over Temp",
            "state": "green",
            "value": 10
        },
        "Overvoltage": {
            "title": "Over Voltage",
            "state": "green",
            "value": 30
        },
        "VoltageDraft": {
            "title": "Voltage Draft",
            "state": "green",
            "value": 30
        },
        "DeepTempCharge": {
            "title": "Deep Temp Charge",
            "state": "green",
            "value": 30
        },
        "Internal Short Circuit": {
            "title": "Internal Short Circuit",
            "state": "green",
            "value": 30
        },
        "DeepDischarge": {
            "title": "Deep Discharge",
            "state": "green",
            "value": 30
        },
        "Overcurrent": {
            "title": "Over Current",
            "state": "green",
            "value": 30
        }
    };

    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chartRef = chart;
        this.clickHandler();
    };
    fastChargeChartCallback: Highcharts.ChartCallbackFunction = (chart: any) => {
        chart.update({
            title: "",
            series: [
                {
                    data: [
                        this.battery?.chargingDetails?.numberOfL2,
                        this.battery?.chargingDetails?.numberOfL1,
                        this.battery?.chargingDetails?.numberOfFastCharges2,
                        this.battery?.chargingDetails?.numberOfFastCharges1,
                    ]
                }
            ],
        });
    };
    charging = true;
    showBatteryInfo = false;
    resetChargingTarget = false;
    chargingTarget = 70;
    lastChargedDate = new Date();
    cellBalancing = false;
    startCooling = true;
    startHeating = false;
    eolDate: Date | undefined;

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
                    this.pipelineData = pipelines.filter((pipeline: GetPipelinesByUserQuery) => pipeline.PipelineStatus === 'PIPELINE_FINISHED' || pipeline.PipelineRetraining)
                        .sort((pipeline1: GetPipelinesByUserQuery, pipeline2: GetPipelinesByUserQuery) => new Date(pipeline1.StatusUpdatedAt).getTime() - new Date(pipeline2.StatusUpdatedAt).getTime())
                        .pop();
                    if (this.pipelineData) {
                        this.showSpinner = true;
                        this.showRetrainMessage = !!this.pipelineData.PipelineRetraining;
                        this.pipelineId = this.pipelineData.Id;
                        this.showError = !!this.pipelineData.ErrorMessage;
                        this.getBatteryMetadata();
                    } else {
                        this.showSpinner = false;
                        this.router.navigate(['/history']).then();
                    }
                }).catch(() => this.router.navigate(['/history'], { queryParams: { error: '500' } }).then());
            } else {
                this.showSpinner = true;
                this.apiService.GetPipelineById(this.pipelineId).then((data: PipelineData) => {
                    this.pipelineData = data;
                    if (this.pipelineData.PipelineStatus !== 'PIPELINE_FINISHED' && !this.pipelineData.PipelineRetraining) {
                        this.router.navigate(['/history'], { queryParams: { error: '400' } }).then();
                    } else {
                        this.showError = !!this.pipelineData.ErrorMessage;
                        this.showRetrainMessage = !!this.pipelineData.PipelineRetraining;
                        this.getBatteryMetadata();
                    }
                }).catch(() => this.router.navigate(['/history'], { queryParams: { error: '500' } }).then());
            }
        });
    }

    getBatteryMetadata() {
        this.dataService.getMetadata(this.username, this.pipelineId).subscribe({
            next: (metadata: any) => {
                this.batteryMetadata = JSON.parse(metadata);
                this.batteries = Object.keys(this.batteryMetadata);
            }, error: () => this.router.navigate(['/history'], { queryParams: { error: '500' } }).then()
        });
    }

    startStreaming() {
        this.startedStream = !this.startedStream;
        if (this.startedStream) {
            this.streamingInterval = setInterval(() => {
                this.forecastSOHData.push(this.streamingData.shift());
                if (!this.streamingData.length && !this.pipelineData?.PipelineRetraining) this.retrain = true;
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
            setTimeout(() => this.showDrift = true, 3000);
        } else {
            this.stopStreaming();
        }
    }

    stopStreaming() {
        this.startedStream = false;
        clearInterval(this.streamingInterval);
    }

    getMultipleRandom(num: number) {
        const shuffled = [...Array(this.battery?.numberOfModules + 1).keys()].sort(() => 0.5 - Math.random());

        return shuffled.slice(1, num);
    }
    //timer = ms => new Promise(res => setTimeout(res, ms))

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    getRandomFloat(min: number, max: number, decimals: number) {
        const str = (Math.random() * (max - min) + min).toFixed(
            decimals,
        );

        return parseFloat(str);
    }


    async scenario1() {
        this.resetData();
        this.battery.modulesUnderWarning = [];
        this.battery.modulesInDanger = [];
        this.dtc_message = "Possible DTC detected. Command to disconnect the Battery sent.";
        // const initialFaultDetections = this.initialFaultDetections
        // this.faultDetections = initialFaultDetections;
        this.faultDetections["OverTemp"]["state"] = "green";
        this.faultDetections["Overvoltage"]["state"] = "green";
        while (this.battery.modulesUnderWarning.length < 4) {
            let randInt = this.getRandomInt(1, this.battery?.numberOfModules + 1);
            if (this.battery.modulesUnderWarning.includes(randInt) == false) {
                this.battery.modulesUnderWarning.push(randInt);
            }
        }

        // this.battery.modulesUnderWarning = this.getMultipleRandom(4);
        this.faultDetections["Overvoltage"]["state"] = "warning";

        this.battery.modulesUnderWarning.forEach((element: number) => {
            this.batteryVoltages[element - 1] = this.getRandomFloat(4.5, 5, 2);
        });
        // for (let k=0; k<this.battery.modulesUnderWarning.length; k++){
        //     this.batteryVoltages[k] = this.getRandomFloat(4.5,5,2);
        // }

        this.battery.modulesInDanger = [];

        setTimeout(() => {
            this.battery.modulesInDanger = this.battery.modulesUnderWarning;
            this.battery.modulesUnderWarning = [];
            this.battery.modulesInDanger.forEach((element: number) => {
                this.batteryVoltages[element - 1] = this.getRandomFloat(5.3, 5.6, 2);
            });

            this.faultDetections["Overvoltage"]["state"] = "danger";
            for (let i = 0; i < this.battery?.numberOfModules + 1; i++) {
                setTimeout(() => {
                    this.battery.modulesInDanger.push(i);
                    this.dtc_message = "DTC : Err_overvoltage_Module_1";
                    // this.batteryVoltages[k] = this.getRandomFloat(5.3,5.6,2);
                }, i * 3000);
            }
        }, 120000);
    }

    scenario2() {
        this.resetData();
        this.battery.modulesUnderWarning = [];
        this.battery.modulesInDanger = [];
        this.dtc_message = "Possible DTC detected. Command to disconnect the Battery sent.";
        this.faultDetections["OverTemp"]["state"] = "green";
        this.faultDetections["Overvoltage"]["state"] = "green";
        // const initialFaultDetections = this.initialFaultDetections
        // this.faultDetections = initialFaultDetections;
        while (this.battery.modulesUnderWarning.length < 4) {
            let randInt = this.getRandomInt(1, this.battery?.numberOfModules + 1);
            if (this.battery.modulesUnderWarning.includes(randInt) == false) {
                this.battery.modulesUnderWarning.push(randInt);
            }
        }

        // this.battery.modulesUnderWarning = this.getMultipleRandom(4);
        this.faultDetections["OverTemp"]["state"] = "warning";

        this.battery.modulesInDanger = [];
        this.battery.modulesUnderWarning.forEach((element: number) => {
            this.batteryTemperature[element - 1] = this.getRandomInt(45, 56);
        });

        // for (let k=0; k<this.battery.modulesUnderWarning.length; k++){
        //     this.batteryTemperature[k] = this.getRandomInt(45,56);
        // }

        setTimeout(() => {
            this.battery.modulesInDanger = this.battery.modulesUnderWarning;
            this.battery.modulesUnderWarning = [];
            this.faultDetections["OverTemp"]["state"] = "danger";
            this.battery.modulesInDanger.forEach((element: number) => {
                this.batteryTemperature[element - 1] = this.getRandomInt(57, 60);
            });

            // for (let k=0; k<this.battery.modulesInDanger.length; k++){
            //     this.batteryTemperature[k] = this.getRandomInt(57,60);
            // }
            for (let i = 0; i < this.battery?.numberOfModules + 1; i++) {
                setTimeout(() => {
                    this.battery.modulesInDanger.push(i);
                    this.dtc_message = "DTC : Err_overtemperature_Module_1";
                }, i * 3000);
            }
        }, 120000);
    }


    retrainPipeline() {
        this.snoozedRetrain = false;
        this.showRetrainMessage = true;
        this.retrain = false;
        this.dataService.retrainPipeline(this.lastChargingCycle + 80, this.pipelineId).subscribe({
            next: () => {
                this.retrainSubscription = this.apiService.PipelineSubListener.subscribe({
                    next: (pipelineData: any) => {
                        if (pipelineData && pipelineData.value.data.pipelineSub?.Id === this.pipelineId) {
                            this.showRetrainMessage = pipelineData.value.data.pipelineSub?.PipelineRetraining;
                            if (!this.showRetrainMessage) {
                                this.retrainSubscription.unsubscribe();
                            }
                        }
                    }, error: this.handleError
                });
            }, error: this.handleError
        });
    }

    resetBatteryInfo() {
        this.linechartDark = null;
        this.forecastSOHData = [];
        this.forecastedSOH = 0;
        this.forecastedRUL = 0;
        this.forecastedStateOfCharge = 0;
        this.stopStreaming();
    }
    resetData() {
        this.faultDetections["OverTemp"]["state"] = "green";
        this.faultDetections["Overvoltage"]["state"] = "green";
        this.dtc_message = "";
        this.battery.modulesUnderWarning = [];
        this.battery.modulesInDanger = [];
        this.setBatteryVoltageTemp();

    }
    setBatteryVoltageTemp() {
        for (let i = 0; i < this.battery?.numberOfModules + 1; i++) {
            this.batteryVoltages.push(this.getRandomFloat(3, 4.2, 2));
            this.batteryTemperature.push(this.getRandomInt(20, 35));
        }
    }

    updateBatteryData(batteryInfo: any) {
        this.displayText = 'Loading Dashboard...';
        // const initialFaultDetections = this.initialFaultDetections
        // this.faultDetections = initialFaultDetections;

        this.getFaultDetections('VSTG4323PMC000011');

        this.showSpinner = true;
        this.showError = false;
        this.selectedBattery = batteryInfo.BatteryId;
        this.battery = this.batteryMetadata[this.selectedBattery];
        this.modules = new Array(this.battery.numberOfModules);
        this.resetBatteryInfo();
        const observables = [
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'past'),
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'predictions'),
            this.dataService.getBatteryData(this.username, this.pipelineId, this.selectedBattery, 'actual')
        ];
        forkJoin(observables).subscribe({
            next: (responses: any[]) => {
                if (responses[0]) {
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
                    this.forecastedStateOfCharge = this.battery.stateOfCharge ?? 85;
                    const predicted = this.futureSOHData[this.futureSOHData.length - 1];
                    const actual = this.streamingData[this.streamingData.length - 1]
                    this.drift = (predicted - actual) * 100 / actual;
                    this.showSpinner = false;
                    this.determineEOlDate();
                } else {
                    this.handleError();
                }
            }, error: this.handleError
        });
        this.linechartDark = null;
        this.forecastSOHData = [];
        this.stopStreaming();
        this.setBatteryVoltageTemp();
        // this.vehicleSubscribe();
    }

    getFaultDetections(batteryId: string) {
        this.faultData = this.dataService.getFaults(batteryId);
    }

    updateFaultDetection() {
        this.dataService.refreshBatteryHealth(this.battery?.batteryName);
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
                style: { color: '#fff' },
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
            this.retrain = false;
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

    private handleError(err?: Error) {
        this.showSpinner = false;
        this.showPipelineStatus = false;
        this.showError = true;
        this.reset()();
        console.log(err);
    }

    setChargingTarget() {
        this.resetChargingTarget = false;
        const marker: any = document.querySelector(`.target-marker`);
        if (marker) {
            marker?.style.setProperty('--target-marker-bottom', `${this.chargingTarget}%`);
        }
    }

    cancelChargingTarget() {
        this.resetChargingTarget = false;
        this.chargingTarget = 80;
    }

    determineEOlDate() {
        const eolCycle = this.battery.expectedEOL;
        const currentCycle = this.lastChargingCycle;
        const numberOfCyclesLeft = eolCycle - currentCycle;
        const currentDate = new Date();
        this.eolDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + numberOfCyclesLeft);
    }

    showFaultHistory(faultType: string, state: string, faultKey: string) {

        this.currentFaultData = this.faultData.find((model: { modelName: string; }) => model.modelName === faultKey).data;
        const type = faultKey === 'Thermal Runaway' ? 'datetime' : 'number';
        this.setFaultLineChartOptions(this.currentFaultData, type);

        this.faultDetectionTitle = faultType;
        this.showFaultDetectionDetails = true;
    }

    private setFaultLineChartOptions(data: any[], x_type: string) {
             
        this.faultLineChartOptions = {
            series: [
                {
                    data: data,
                    color: '#38EF7D',
                    name: 'Probabilities',
                    type: 'line'
                },
            ],
            chart: {
                type: 'line',
                backgroundColor: '#2D343D',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                reflow: false,
            },
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
                    text: 'Probability (%)',
                    style: {
                        color: '#fff'
                    }
                },
                gridLineColor: '#888',
                gridLineWidth: 1,
            },
            xAxis: {
                type: x_type,
                labels: {
                    style: {
                        color: '#fff'
                    }
                }
            },
            tooltip: {
                backgroundColor: '#2D343D',
                style: { color: '#fff' },
                //@ts-ignore
                formatter: function () {
                    // @ts-ignore
                    const x: any = this.x;
                    // @ts-ignore
                    const y: any = this.y;
                    if (x && y) {
                        return `<div><strong>Cell Index: </strong>${x}</div><div><strong>Probability:</strong> ${y}%</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        };
    }

    async vehicleSubscribe() {
        this.apiService.SubscribeToBatteryHealth(this.battery?.batteryName).subscribe({
            next: (batteryInfo: any) => {

                console.log(batteryInfo);
                console.log(batteryInfo.value.data.onUpdateBatteryHealth);
                let battery_data = batteryInfo.value.data.onUpdateBatteryHealth;
                let temp = this.faultDetections as any;
                for (var key in battery_data) {
                    console.log(key);
                    if (key != 'battery') {
                        let col_data = JSON.parse(battery_data[key])
                        console.log(col_data);
                        if (col_data.hasOwnProperty("state")) {
                            temp[key]["state"] = col_data.state;
                        }
                    }
                    this.faultDetections = temp;

                }
            }
        })
    }
    navigateToAnalytics() {
        // annotation timestamp
        this.router.navigate(['/analytics', this.selectedBattery, '2023-12-01T01:48:00.000Z']);
      }
}
