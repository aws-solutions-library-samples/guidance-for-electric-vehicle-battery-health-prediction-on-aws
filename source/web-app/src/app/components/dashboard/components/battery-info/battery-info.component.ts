import { Component, EventEmitter, Input, Output } from "@angular/core";
import { faClose } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-battery-info",
  templateUrl: "./battery-info.component.html",
  styleUrls: ["./battery-info.component.scss"],
})
export class BatteryInfoComponent {
  @Input() battery: any;
  @Input() visible: boolean | undefined;
  @Output() notifyInfoPanelClose = new EventEmitter<boolean>();

  faClose = faClose;
}
