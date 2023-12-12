import { Component, OnInit } from "@angular/core";
import Highcharts from "highcharts";
import { ActivatedRoute } from '@angular/router';
import { DataService } from "../../../../services/data.service";


@Component({
    selector: 'app-analytics',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
    vehicleOptions: string[] = ['lat', 'lng', 'velocity', 'ambient_air_temp', 'odom'];
    batteryOptions: string[] = ['current', 'state_of_health', 'state_of_health_resistance', 'state_of_charge', 'temp_average', 'capacity_throughput', 'charge_throughput'];
    cellOptions: string[] = ['voltage'];
    selectedOption1: string = this.vehicleOptions[0];
    selectedOption2: string = this.batteryOptions[0];
    selectedOption3: string = this.cellOptions[0];
    selectedStartTime: string = '';
    selectedEndTime: string = '';
    selectedInterval: string = '';
    highcharts = Highcharts;
    private chartRef: any;
    selectedBattery: string = '';
    analyticsLineChartOptions1: any = {};
    analyticsLineChartOptions2: any = {};
    analyticsLineChartOptions3: any = {};
    constructor(private route: ActivatedRoute,
                private dataService: DataService) {
        this.route.params.subscribe((params: any) => {
            if (params.id) {
                this.selectedBattery = params.id;
            }
        });
    }

    ngOnInit(): void {
        this.updateAllCharts()
    }
    chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
        this.chartRef = chart;
    }
    updateChart1Options() {
        const data = this.dataService.getAnalyticsForVehicle(this.selectedBattery)
        this.setAnalyticsLineChart1Options(data);
    }
    updateChart2Options() {
        const data = this.dataService.getAnalyticsForBattery(this.selectedBattery)
        this.setAnalyticsLineChart2Options(data);
    }
    updateChart3Options() {
        const data = this.dataService.getAnalyticsForCell(this.selectedBattery)
        this.setAnalyticsLineChart3Options(data);
    }
    updateAllCharts() {
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
                    name: this.selectedOption2,
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
                    text: this.selectedOption1,
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
                    if (x && y) {
                        return `<div><strong>Timestamp: </strong>${x}</div><div><strong>Sensor value:</strong> ${y}</div>`
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
                    name: this.selectedOption2,
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
                    text: this.selectedOption2,
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
                    if (x && y) {
                        return `<div><strong>Timestamp: </strong>${x}</div><div><strong>Sensor value:</strong> ${y}</div>`
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
            series: [
                {
                    data: data,
                    color: '#DF2A5D',
                    name: this.selectedOption2 + '(Cell 1)',
                    type: 'line'
                },
                {
                    data: [[1,2], [2,9], [3,5], [4,2], [5,9], [6,5], [7,5]],
                    color: '#DF2A5D',
                    name: this.selectedOption2 + '(Cell 2)',
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
                    text: this.selectedOption3,
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
                    if (x && y) {
                        return `<div><strong>Timestamp: </strong>${x}</div><div><strong>Sensor value:</strong> ${y}</div>`
                    } else {
                        return;
                    }
                },
                useHTML: true
            }
        }
    }
}
