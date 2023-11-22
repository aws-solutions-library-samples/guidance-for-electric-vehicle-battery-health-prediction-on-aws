import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.scss']
})
export class SwitchComponent implements OnChanges {

    @Input() currentState: boolean|undefined;
    on = false;


    ngOnChanges( changes: SimpleChanges ): void {
        if (changes && changes["currentState"] && changes["currentState"].currentValue != undefined) {
            this.on = changes["currentState"].currentValue
        }
    }

}
