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

import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  faBug,
  faCircleCheck,
  faFileCsv,
} from "@fortawesome/free-solid-svg-icons";
import { faPython } from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: "app-dataset-selection",
  templateUrl: "./dataset-selection.component.html",
  styleUrls: ["../../pipeline.component.scss"],
})
export class DatasetSelectionComponent implements OnInit {
  datasetSelectionTab = 1;
  faCheck = faCircleCheck;
  faBug = faBug;
  faCsv = faFileCsv;
  faPython = faPython;
  showUploadError = false;
  file: any;
  s3Uri: string | undefined;
  @Input() uri: any;
  @ViewChild("datasetInput") datasetInput: ElementRef | undefined;

  ngOnInit(): void {
    this.s3Uri = this.uri;
  }

  dragEnterHandler(event: DragEvent) {
    event.preventDefault();
    const container = document.querySelector(".dataset-upload");
    if (container) {
      container.classList.add("drop-enter");
    }
  }

  dragLeaveHandler(event: DragEvent) {
    event.preventDefault();
    const container = document.querySelector(".dataset-upload");
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
      this.file = files[0];
    } else {
      this.showUploadError = true;
    }
    const container = document.querySelector(".dataset-upload");
    if (container) {
      container.classList.remove("drop-enter");
    }
  }

  triggerInput() {
    this.datasetInput?.nativeElement.click();
  }

  onDatasetUpload(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.file = event.target.files[0];
  }

  validateUpload(file: File) {
    return file.name.includes(".csv");
  }
}
