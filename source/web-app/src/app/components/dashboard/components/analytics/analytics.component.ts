import { Component, OnInit } from "@angular/core";
import Highcharts from "highcharts";
import { ActivatedRoute } from "@angular/router";
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

type CellDataEntry = {
  bucket: string;
  vehicle_id: string;
  battery_id: string;
  voltage: number;
};

interface CellData {
  [cellId: string]: CellDataEntry[];
}

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.scss"],
})
export class AnalyticsComponent implements OnInit {
  vehicleOptions: string[] = [
    "lat",
    "lng",
    "velocity",
    "ambient_air_temp",
    "odom",
  ];
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
  selectedVehicleOption: string = this.vehicleOptions[0];
  selectedBatteryOption: string = this.batteryOptions[0];
  selectedCellOption: string = this.cellOptions[0];
  selectedStartTime: string = "";
  selectedEndTime: string = "";
  vehicleData = [] as VehicleData[];
  batteryData = [] as BatteryData[];
  cellData = {} as CellData;
  highcharts = Highcharts;
  annotationTimestamp: string = "";
  private vehicleChartRef: any;
  private batteryChartRef: any;
  private cellChartRef: any;
  selectedBattery: string = "";
  vehicleLineChartOptions: Highcharts.Options | undefined = undefined;
  batteryLineChartOptions: Highcharts.Options | undefined = undefined;
  cellLineChartOptions: Highcharts.Options | undefined = undefined;

  constructor(private route: ActivatedRoute, private dataService: DataService) {
    this.route.params.subscribe((params: any) => {
      this.selectedBattery = params.id ?? "";
      this.annotationTimestamp = params.annotationTimestamp ?? "";
      console.log(Date.parse(this.annotationTimestamp));
    });
  }

  ngOnInit(): void {
    this.selectedStartTime =
      this.selectedStartTime === ""
        ? this.getFormattedDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
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

  analyticsOptionsInitialize(): Highcharts.Options {
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
          text: this.selectedCellOption,
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

  updateVehicleChart() {
    const vehicleData = this.vehicleData.map(
      (entry: { [x: string]: any; bucket: any }) => [
        new Date(entry.bucket).getTime(),
        entry[this.selectedVehicleOption],
      ]
    );
    this.vehicleLineChartOptions = {
      series: [
        {
          type: "line",
          color: "#38EF7D",
          name: this.selectedVehicleOption,
          data: vehicleData,
        },
      ],
      ...this.analyticsOptionsInitialize(),
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
      ...this.analyticsOptionsInitialize(),
    };
  }

  updateCellChart() {
    const seriesEntries = Object.keys(this.cellData).map(
      (cellId): Highcharts.SeriesOptionsType => {
        const cellData = this.cellData[cellId].map(
          (entry: { [x: string]: any; bucket: any }) => [
            new Date(entry.bucket).getTime(),
            entry[this.selectedCellOption],
          ]
        );

        return {
          data: cellData,
          color: "#DF2A5D",
          name: this.selectedCellOption + " (" + cellId + ")",
          type: "line",
        };
      }
    );

    this.cellLineChartOptions = {
      series: seriesEntries,
      ...this.analyticsOptionsInitialize(),
    };
  }

  updateAllCharts() {
    const data = this.dataService
      .getAnalytics(
        this.selectedBattery,
        this.selectedStartTime,
        this.selectedEndTime
      )
      .subscribe((data: any) => {
        this.vehicleData = data.message.vehicle;
        this.batteryData = data.message.battery;
        this.cellData = data.message.cell;

        this.updateVehicleChart();
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
