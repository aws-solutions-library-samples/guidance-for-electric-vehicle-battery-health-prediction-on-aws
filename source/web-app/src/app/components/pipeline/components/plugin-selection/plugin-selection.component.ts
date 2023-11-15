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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {faBug, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {faPython} from "@fortawesome/free-brands-svg-icons";

@Component({
    selector: 'app-plugin-selection',
    templateUrl: './plugin-selection.component.html',
    styleUrls: ['../../pipeline.component.scss', 'plugin-selection.component.scss']
})
export class PluginSelectionComponent implements OnInit {
    pluginSelectionTab = 1;
    faCheck = faCircleCheck;
    faBug = faBug;
    faPython = faPython;
    showUploadError = false;
    plugin: any;
    s3Uri: string | undefined;
    existingPlugin: any;
    showHelp = false;

    @Input() uri: any;
    @ViewChild("pluginInput") pluginInput: ElementRef | undefined;

    toggleHelp = () => {
        this.showHelp = false;
        this.removeClickEvent()
    }
    toggleHelpBind = this.toggleHelp.bind(this);

    ngOnInit(): void {
        this.s3Uri = this.uri;
    }

    dragEnterHandler(event: DragEvent) {
        event.preventDefault();
        const container = document.querySelector(".plugin-upload");
        if (container) {
            container.classList.add("drop-enter");
        }
    }

    dragLeaveHandler(event: DragEvent) {
        event.preventDefault();
        const container = document.querySelector(".plugin-upload");
        if (container) {
            container.classList.remove("drop-enter");
        }
    }

    dragOverHandler(event: DragEvent) {
        event.preventDefault();
    }

    dropHandler(event: any) {
        event.preventDefault();
        event.stopPropagation();
        this.showUploadError = false;
        const files: any = Array.from(event.dataTransfer.files) || [];
        if (this.validateUpload(files[0])) {
            this.plugin = files[0];
        } else {
            this.showUploadError = true;
        }
        const container = document.querySelector(".plugin-upload");
        if (container) {
            container.classList.remove("drop-enter");
        }
    }

    triggerPluginInput() {
        this.pluginInput?.nativeElement.click();
    }

    onPluginUpload(event: any) {
        event.stopPropagation();
        event.preventDefault();
        this.plugin = event.target.files[0];
    }

    validateUpload(file: File) {
        return file.name.includes('.py');
    }

    helpHandler() {
        this.showHelp = !this.showHelp;
        if(this.showHelp) {
            setTimeout(() => {
                window.addEventListener('click', this.toggleHelpBind);
            });
        }
    }

    private removeClickEvent() {
        window.removeEventListener('click', this.toggleHelpBind);
    }
}
