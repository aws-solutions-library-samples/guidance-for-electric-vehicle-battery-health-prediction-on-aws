import { Component, Input, OnInit } from "@angular/core";
import Highcharts from "highcharts";
import { DataService } from "../../../../services/data.service";

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

interface CellData {
  bucket: string;
  voltage: number;
}

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  batteryOptions: string[] = [
    "current",
    "state_of_health",
    "state_of_health_resistance",
    "state_of_charge",
    "temp_average",
    "capacity_throughput",
    "charge_throughput",
  ];
  cellOptions: string[] = ["voltage"];
  selectedBatteryOption: string = this.batteryOptions[0];
  selectedCellOption: string = this.cellOptions[0];
  selectedStartTime = "";
  selectedEndTime = "";
  vehicleData = [] as VehicleData[];
  batteryData = [] as BatteryData[];
  cellData = [] as CellData[];
  highcharts = Highcharts;
  @Input() annotationTimestamp = "";
  private vehicleChartRef: any;
  private batteryChartRef: any;
  private cellChartRef: any;
  @Input() selectedBattery = "";
  vehicleLineChartOptions: Highcharts.Options | undefined = undefined;
  batteryLineChartOptions: Highcharts.Options | undefined = undefined;
  cellLineChartOptions: Highcharts.Options | undefined = undefined;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.selectedStartTime =
      this.selectedStartTime === ""
        ? this.getFormattedDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        : this.selectedStartTime;
    this.selectedEndTime =
      this.selectedEndTime === ""
        ? this.getFormattedDate(new Date())
        : this.selectedEndTime;
    this.updateAllCharts();
  }
  vehicleChartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.vehicleChartRef = chart;
  };
  batteryChartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.batteryChartRef = chart;
  };
  cellChartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.cellChartRef = chart;
  };

  analyticsOptionsInitialize(label: string): Highcharts.Options {
    return {
      chart: {
        type: "line",
        backgroundColor: "#2D343D",
        zoomType: "x",
        panKey: "shift",
        reflow: false,
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "#2D343D",
        style: { color: "#fff" },
        //@ts-ignore
        formatter: function () {
          // @ts-ignore
          const x: any = this.x;
          // @ts-ignore
          const y: any = this.y;
          if (x && y) {
            return `<div><strong>Timestamp: </strong>${new Date(
              x
            ).toISOString()}</div><div><strong>Sensor value:</strong> ${y}</div>`;
          } else {
            return;
          }
        },
        useHTML: true,
      },
      credits: {
        enabled: false,
      },
      yAxis: {
        labels: {
          style: {
            color: "#fff",
          },
        },
        title: {
          text: label,
          style: {
            color: "#fff",
          },
        },
        gridLineColor: "#888",
        gridLineWidth: 1,
      },
      xAxis: {
        type: "datetime",
        labels: {
          style: {
            color: "#fff",
          },
          rotation: -45,
        },
        plotLines: [
          {
            color: "red",
            dashStyle: "Dash",
            value: Date.parse(this.annotationTimestamp),
            width: 2,
            zIndex: 5,
          },
        ],
      },
    };
  }

  updateBatteryChart() {
    const batteryData = this.batteryData.map(
      (entry: { [x: string]: any; bucket: any }) => [
        new Date(entry.bucket).getTime(),
        entry[this.selectedBatteryOption],
      ]
    );

    this.batteryLineChartOptions = {
      series: [
        {
          type: "line",
          color: "#FF9900",
          name: this.selectedBatteryOption,
          data: batteryData,
        },
      ],
      ...this.analyticsOptionsInitialize(this.selectedBatteryOption),
    };
  }

  updateCellChart() {
    const cellData = this.cellData.map(
      (entry: { [x: string]: any; bucket: any }) => [
        new Date(entry.bucket).getTime(),
        entry[this.selectedCellOption],
      ]
    );

    this.cellLineChartOptions = {
      series: [{
        data: cellData,
        color: "#DF2A5D",
        name: this.selectedCellOption,
        type: "line",
      }],
      ...this.analyticsOptionsInitialize(this.selectedCellOption),
    };
  }

  updateAllCharts() {
    this.dataService
      .getAnalytics(
        this.selectedBattery,
        this.selectedStartTime,
        this.selectedEndTime
      )
      .subscribe((data: any) => {
        this.batteryData = data.message.battery;
        this.cellData = data.message.cell;

        this.updateBatteryChart();
        this.updateCellChart();
      });
  }

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
