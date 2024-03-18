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
import {APIService, GetPipelineByIdQuery, GetPipelinesByUserQuery, PipelineData} from "../../services/api.service";
import {DataService} from "../../services/data.service";
// @ts-ignore
import * as Highcharts from 'highcharts';
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin} from "rxjs";
import AnnotationsModule from 'highcharts/modules/annotations';
import SolidGauge from 'highcharts/modules/solid-gauge';
import HC_more from "highcharts/highcharts-more";
import {Auth} from "aws-amplify";

import {WebsocketService} from '../../services/websocket.service';

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
    private intervalId: any;
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
    faultData: any = [];
    faultRealTimeData: any = {};
    currentFaultData: any = {};
    currentRealTimeFaultData: any = {};
    isAccDeg = false;
    accDegChartOptions: any = {};
    faultLineChartOptions: any = {};
    faultStatistics: any = {};
    faultDetections = {
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
        "Overcurrent": {
            "title": "Over Current",
            "state": "green",
            "value": 30
        },
        "AccDeg": {
            "title": "Accelerated Degradation",
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
    currentRealTimeFaultLineChartOptions: any = {};

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
    anomalyModels = false;
    eolDate: Date | undefined;
    showAnalytics = false;
    annotationTimestamp = "";

    constructor(private apiService: APIService,
        private dataService: DataService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private websocketService: WebsocketService) {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            if (params.uuid) {
                this.pipelineId = params.uuid;
            }
        });
    }

    ngOnInit(): void {
        this.websocketService.connect();
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

    toggleAnomalyModelSwitch() {
        this.anomalyModels = !this.anomalyModels;
        if (this.anomalyModels) {
            if (this.selectedBattery === 'KNADE163966083101') {
                setTimeout(() => {
                    this.faultDetections['AccDeg']["state"] = "danger";
                }, 3000);
                return;
            }
            this.sendTriggerModelsRequest();
            this.intervalId = setInterval(() => {
              this.sendTriggerModelsRequest();
            }, 30000);
          } else {
            clearInterval(this.intervalId);
            Object.keys(this.faultDetections).forEach((faultKey: string) => {
                this.faultDetections[faultKey as keyof typeof this.faultDetections]["state"] = "green";
            });
          }
    }

    private sendTriggerModelsRequest() {
        this.dataService.getTriggerAnomalyResult(this.selectedBattery).subscribe(response => {
           console.log(response);
        });
    }

    setBatteryVoltageTemp() {
        for (let i = 0; i < this.battery?.numberOfModules + 1; i++) {
            this.batteryVoltages.push(this.getRandomFloat(3, 4.2, 2));
            this.batteryTemperature.push(this.getRandomInt(20, 35));
        }
    }

    updateBatteryData(batteryInfo: any) {
        this.displayText = 'Loading Dashboard...';
        // this vehicle subscribe is for fault detection will be uncommented later
        this.getFaultDetections(batteryInfo.VIN, batteryInfo.BatteryId);

        this.showSpinner = true;
        this.showError = false;
        this.selectedBattery = batteryInfo.BatteryId;
        this.battery = this.batteryMetadata[this.selectedBattery];
        this.modules = new Array(this.battery.numberOfModules);
        this.resetBatteryInfo();
        const batteryId = this.selectedBattery.slice(-1) % 2 === 0 ? 'b1' : 'b3';

        const observables = [
            this.dataService.getBatteryData(this.username, this.pipelineId, batteryId, 'past'),
            this.dataService.getBatteryData(this.username, this.pipelineId, batteryId, 'predictions'),
            this.dataService.getBatteryData(this.username, this.pipelineId, batteryId, 'actual')
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

    getFaultDetections(VIN: string, batteryId: string) {
        this.faultData = [];
        Object.keys(this.faultDetections).forEach((faultKey: string) => {
            this.faultDetections[faultKey as keyof typeof this.faultDetections]["state"] = "green";
        });

        this.websocketService.receiveMessage().subscribe((message: any) => {

            if (message[VIN]) {
                const faultData = message[VIN];
                Object.keys(faultData).forEach((faultKey: string) => {
                    if (faultKey === "timestamp") {
                        return;
                    }
                        const faultName: string = faultKey;
                    const fault: any = faultData[faultKey];
                    this.faultDetections[faultName as keyof typeof this.faultDetections]["state"] = fault.state;
                    this.faultRealTimeData[faultName as keyof typeof this.faultData] = fault.data;
                });
            }
        }
        );
        
        this.dataService.getLithiumPlatingResults(batteryId).subscribe((data: any) => {
            this.faultData.push(data.message);
            this.faultData.forEach((model: { modelName: string; }) => {
                this.faultDetections[model.modelName as keyof typeof this.faultDetections]["state"] = "danger";
            })
        }, () => {
            console.log('no lithium plating data')
        });

        this.dataService.getThermalRunawayResults(batteryId).subscribe((data: any) => {
            this.faultData.push(data.message);
            this.faultData.forEach((model: { modelName: string; }) => {
                this.faultDetections[model.modelName as keyof typeof this.faultDetections]["state"] = "danger";
            })
        }, () => {
            console.log('no thermal runaway data')
        });

        this.dataService.getAccDegResults(batteryId).subscribe((data: any) => {
            this.faultData.push(data.message);
            this.isAccDeg = true;
            this.setAccDegChartOptions(data.message.data);
        }, () => {
            console.log('no acc deg data')
            this.isAccDeg = false;
        });
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
        // this.showError = true;
        // this.reset()();
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
        this.currentRealTimeFaultData = this.faultRealTimeData[faultKey];
        
        
        this.showFaultDetectionDetails = true;
        this.faultDetectionTitle = faultType;
        if (this.currentRealTimeFaultData) {
            const occurencesData = this.currentRealTimeFaultData.occurenceTimestamps.map((timestamp: any, index: number) => ({x: (new Date(timestamp)).getTime(),
                                                                                                                                y: index + 1,
                                                                                                                                extraVal: this.currentRealTimeFaultData.values[index]}));
            this.setCurrentRealTimeFaultLineChartOptions(occurencesData);
            return;
        }
        this.currentFaultData = this.faultData.find((model: { modelName: string; }) => model.modelName === faultKey).data;
        
        let type = 'number';
        let isTR = false;
        if (faultKey === 'Thermal Runaway') {
            type = 'datetime';
            this.currentFaultData = this.currentFaultData.map((data: any) => {
                return [(new Date(data[0])).getTime(), data[1]];
            })
            isTR = true;
        }

        this.setFaultLineChartOptions(this.currentFaultData, type, isTR);
    }

    private setAccDegChartOptions(data: any[]) {
        const transformedData: { [key: string]: {x: number; y:number;}[]} = {};

        data.forEach(item => {
            const timestamp = (new Date(item.bucket)).getTime();
            if (transformedData[item.cell_id]) {
                transformedData[item.cell_id].push({x: timestamp, y: item.voltage});
            } else {
                transformedData[item.cell_id] = [{x: timestamp, y: item.voltage}];
            }
        });

        const series = Object.keys(transformedData).map(cell_id => {
            return {
                name: cell_id,
                data: transformedData[cell_id],
                type: 'line',
                color: cell_id === 'Cell41Volt' ? '#fc3203' : '#38EF7D'
            };
        });

        this.accDegChartOptions = {
            series: series,
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
                    text: 'Voltage (V)',
                    style: {
                        color: '#fff'
                    }
                },
                gridLineColor: '#888',
                gridLineWidth: 1,
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#fff'
                    }
                },
                plotLines: [{
                    color: 'red', // Line color
                    width: 2,      // Line width
                    value: Date.parse('2023-12-01T01:40:00.000Z'), 
                    label: {
                        text: 'AI Based', // Label text
                        rotation: 90,            // Label rotation
                        textAlign: 'center',    // Label text alignment
                        // x: 10,                  // Offset from the x-axis,
                        style: {
                            color: 'white',
                            fontweight: 'bold'
                        },
                        y: 50
                    }
                },
                {
                    color: 'blue', // Line color
                    width: 2,      // Line width
                    value: Date.parse('2023-12-01T02:30:00.000Z'), 
                    label: {
                        text: 'Threshold Based', // Label text
                        rotation: 90,            // Label rotation
                        textAlign: 'center',    // Label text alignment
                        style: {
                            color: 'white',
                            fontweight: 'bold'
                        },
                        y: 50
                    }
                }]
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
                        // @ts-ignore
                        return `<div><strong>Cell Index: </strong>${this.series.name.slice(0, -4)}</div><div><strong>Timestamp: </strong>${(new Date(x).toISOString())}</div><div><strong>Voltage:</strong> ${y}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            },
            legend:{ enabled:false }
        };
    }

    private setCurrentRealTimeFaultLineChartOptions(data: any[]) {
        this.currentRealTimeFaultLineChartOptions = {
            series: [
                {
                    data: data,
                    color: '#38EF7D',
                    name: 'Occurences',
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
                    text: 'Occurences',
                    style: {
                        color: '#fff'
                    }
                },
                gridLineColor: '#888',
                gridLineWidth: 1,
            },
            xAxis: {
                type: 'datetime',
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
                    // @ts-ignore
                    const extraVal: any = this.point.extraVal;
                    if (x && y) {
                        return `<div><strong>Timestamp: </strong>${(new Date(x).toISOString())}</div><div><strong>Occurences:</strong> ${y}</div><div><strong>Value:</strong> ${extraVal}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        };
    }

    private setFaultLineChartOptions(data: any[], x_type: string, isTR: boolean) {
        this.faultLineChartOptions = {
            series: [
                {
                    data: data,
                    color: '#38EF7D',
                    name: 'Probabilities',
                    type: 'column'
                },
            ],
            chart: {
                type: 'column',
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
                plotLines: isTR ? [{
                    color: 'red',  // Line color
                    width: 2,      // Line width
                    value: 0.25,   // Position on the x-axis where the line will be drawn
                    label: {
                        text: 'Prob. Threshold',  // Label text
                        rotation: 0,            // Label rotation
                        textAlign: 'center',    // Label text alignment
                        x: 50,                  // Offset from the x-axis
                        style: {
                            color: 'white',
                            fontweight: 'bold'
                        }
                    }
                }] : []
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
                        return `<div><strong>Probability:</strong> ${y}%</div>`
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
    navigateToAnalytics(withTimestamp = false) {
        this.annotationTimestamp = withTimestamp ? 
            this.faultData?.find((model: { modelName: string; }) => model.modelName === this.faultDetectionTitle)?.annotationTimestamp : "";
        this.showAnalytics = true;
    }
}
