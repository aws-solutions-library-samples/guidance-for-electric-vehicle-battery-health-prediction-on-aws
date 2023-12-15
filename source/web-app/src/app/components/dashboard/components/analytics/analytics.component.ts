import { Component, OnInit } from "@angular/core";
import Highcharts from "highcharts";
import { ActivatedRoute } from '@angular/router';
import { DataService } from "../../../../services/data.service";
import { time } from "console";

interface VehicleData {
    bucket: string;
    vehicle_id: string;
    lat?: number;
    lng?: number;
    velocity?: number;
    odom?: number;
    ambient_air_temp?: number;
}

interface BatteryData {
    bucket: string;
    vehicle_id: string;
    battery_id: string;
    current?: number;
    state_of_charge?: number;
    state_of_health?: number;
    state_of_health_resistance?: number;
    temp_average?: number;
    capacity_throughput?: number;
    charge_throughput?: number;
  }

  type CellDataEntry = {
    bucket: string;
    vehicle_id: string;
    battery_id: string;
    voltage: number;
};

  interface CellData {
    [cellId: string]: CellDataEntry[]
};
  

@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {
    vehicleOptions: string[] = ['lat', 'lng', 'velocity', 'ambient_air_temp', 'odom'];
    batteryOptions: string[] = ['current', 'state_of_health', 'state_of_health_resistance', 'state_of_charge', 'temp_average', 'capacity_throughput', 'charge_throughput'];
    cellOptions: string[] = ['voltage'];
    selectedVehicleOption: string = this.vehicleOptions[0];
    selectedBatteryOption: string = this.batteryOptions[0];
    selectedCellOption: string = this.cellOptions[0];
    selectedStartTime: string = '';
    selectedEndTime: string = '';
    vehicleData = {} as VehicleData[]
    batteryData = {} as BatteryData[]
    cellData = {} as CellData
    highcharts = Highcharts;
    annotationTimestamp: string = '';
    private chartRef: any;
    selectedBattery: string = '';
    analyticsLineChartOptions1: any = {};
    analyticsLineChartOptions2: any = {};
    analyticsLineChartOptions3: any = {};

    constructor(private route: ActivatedRoute,
                private dataService: DataService) {
        this.route.params.subscribe((params: any) => {
            this.selectedBattery = params.id ?? '';
            this.annotationTimestamp = params.annotationTimestamp ?? '';
            this.selectedStartTime = params.timeStart ?? '';
            this.selectedEndTime = params.timeEnd ?? '';
        });
    }

    ngOnInit(): void {
        this.updateAllCharts()
    }
    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chartRef = chart;
    }
    updateChart1Options() {
        const data = this.vehicleData.map((entry: { [x: string]: any; bucket: any; }) => [
                (new Date(entry.bucket)).getTime(),
                entry[this.selectedVehicleOption]
          ]);
        
        console.log(data)
        this.setAnalyticsLineChart1Options(data);
    }
    updateChart2Options() {
        const data = this.batteryData.map((entry: { [x: string]: any; bucket: any; }) => [
            (new Date(entry.bucket)).getTime(),
                entry[this.selectedBatteryOption]
          ]);
        this.setAnalyticsLineChart2Options(data);
    }
    updateChart3Options() {
        const seriesEntries = Object.keys(this.cellData).map(cellId => {
            const cellData = this.cellData[cellId].map((entry: { [x: string]: any; bucket: any; }) => ({
              x: (new Date(entry.bucket)).getTime(),
              y: entry[this.selectedCellOption]
            }));
        
            return {
              data: cellData,
              color: '#DF2A5D',
              name: this.selectedCellOption + " (" + cellId +")",
              type: 'line'
            };
          });
        this.setAnalyticsLineChart3Options(seriesEntries);
    }
    updateAllCharts() {
        this.parseAnalytics();
        this.updateChart1Options();
        this.updateChart2Options();
        this.updateChart3Options();
    }

    private setAnalyticsLineChart1Options(data: any[]) {
        this.analyticsLineChartOptions1 = {
            series: [
                {
                    data: data,
                    color: '#38EF7D',
                    name: this.selectedVehicleOption,
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
                    text: this.selectedVehicleOption,
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
                    },
                    rotation: -45
                },
                plotLines: [{
                    color: 'red',
                    dashStyle: 'dash',
                    value: Date.parse(this.annotationTimestamp),
                    width: 2,
                    zIndex: 5,
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
                        return `<div><strong>Timestamp: </strong>${(new Date(x).toISOString())}</div><div><strong>Sensor value:</strong> ${y}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        }
    }

    private setAnalyticsLineChart2Options(data: any[]) {
        this.analyticsLineChartOptions2 = {
            series: [
                {
                    data: data,
                    color: '#FF9900',
                    name: this.selectedBatteryOption,
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
                    text: this.selectedBatteryOption,
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
                    },
                    rotation: -45
                },
                plotLines: [{
                    color: 'red',
                    dashStyle: 'dash',
                    value: Date.parse(this.annotationTimestamp),
                    width: 2,
                    zIndex: 5,
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
                        return `<div><strong>Timestamp: </strong>${(new Date(x).toISOString())}</div><div><strong>Sensor value:</strong> ${y}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        }
    }

    private setAnalyticsLineChart3Options(data: any[]) {
        
        this.analyticsLineChartOptions3 = {
            series: data,
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
                    text: this.selectedCellOption,
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
                    },
                    rotation: -45
                },
                plotLines: [{
                    color: 'red',
                    dashStyle: 'dash',
                    value: Date.parse(this.annotationTimestamp),
                    width: 2,
                    zIndex: 5,
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
                        return `<div><strong>Timestamp: </strong>${(new Date(x).toISOString())}</div><div><strong>Sensor value:</strong> ${y}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        }
    }

    parseAnalytics() {
        const data = this.dataService.getAnalytics(this.selectedBattery, this.selectedStartTime, this.selectedEndTime);
        if (data) {
            const { vehicle, battery, cell } = data;
            this.vehicleData = vehicle
            this.batteryData = battery
            this.cellData = cell
        }
    }
}
