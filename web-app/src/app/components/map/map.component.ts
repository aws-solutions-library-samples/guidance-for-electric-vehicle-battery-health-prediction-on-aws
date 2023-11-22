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

import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {createMap} from "maplibre-gl-js-amplify";
import * as maplibregl from "maplibre-gl";
import {APIService, GetLocationDataQuery} from "../../services/api.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  map: any;
  locations: GetLocationDataQuery[] = [];
  batteryInfo: any;
  showVehicleInfo = false;
  showSpinner = false;

  @Input() batteries: any;
  @Output() batterySelectionEmitter = new EventEmitter<any>();
  @Output() mapCreationEmitter = new EventEmitter<boolean>();
  constructor(private apiService: APIService) {
  }

  public ngAfterViewInit(): void {
      this.apiService.GetLocationData().then(locations => {
         this.locations = locations.filter(location => this.batteries.includes(location.BatteryId));
         this.loadMap();
      });
  }

  private loadMap(): void {
    createMap({
      container: 'map',
      center: [0, 0],
      zoom: 5,
      attributionControl: false
    })
    .then((map: any) => {
      this.map = map;
      this.map.addControl(new maplibregl.NavigationControl({}), 'top-left');
      this.map.addControl(new maplibregl.AttributionControl({customAttribution: ['Battery Locations']}));
        this.locations.forEach((l: any) => {
            const loc = document.createElement('div');
            const pin = document.createElement('div');
            const pulse = document.createElement('div');
            loc.classList.add('loc');
            pin.classList.add("pin");
            if (l.BatteryId === 'b1')
                pin.classList.add('charging')
            else if (l.BatteryId === 'b2')
                pin.classList.add('not-charging')
            else
                pin.classList.add('need-charging')
            pulse.classList.add("pulse");
            loc.append(pin, pulse);
            const marker = new maplibregl.Marker(loc, {
                anchor: 'bottom',
            });
            marker.setLngLat([l.Lng, l.Lat]);
            marker.setPopup(new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            }).setHTML(`
                <div class="map-tooltip">
                    <h3>${l.City}, ${l.Country}</h3>
                    <div><strong>VIN: </strong>${l.VIN}</div>
                    <div><strong>Battery: </strong>${l.BatteryId}</div>
                </div>`));
            marker.addTo(this.map);
            loc.addEventListener('click', (event: any) => {
                event.stopImmediatePropagation();
                event.preventDefault();
                marker.togglePopup();
                this.batteryInfo = l;
                this.batterySelectionEmitter.emit(this.batteryInfo);
            });
            loc.addEventListener('mouseenter', () => marker.togglePopup());
            loc.addEventListener('mouseleave', () => marker.togglePopup());
        });
        this.map.flyTo({center: [this.locations[0].Lng, this.locations[0].Lat], zoom: 5});
        this.mapCreationEmitter.emit(true);
        setTimeout(() => this.showVehicleInfo = true, 1000);
    });
  }

}
