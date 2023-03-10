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

import {Component, ViewChild} from "@angular/core";
import {faFileCsv,} from "@fortawesome/free-solid-svg-icons";
import {faPython} from "@fortawesome/free-brands-svg-icons";
import {DataService} from "../../services/data.service";
// @ts-ignore
import {v4 as uuidv4} from "uuid";
import {APIService, PipelineRequestInput} from "../../services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {Auth} from "aws-amplify";
import {forkJoin} from "rxjs";
import {DatasetSelectionComponent} from "./components/dataset-selection/dataset-selection.component";
import {PluginSelectionComponent} from "./components/plugin-selection/plugin-selection.component";

@Component({
  selector: "app-pipeline",
  templateUrl: "./pipeline.component.html",
  styleUrls: ["./pipeline.component.scss"],
})
export class PipelineComponent {
  currentDate = new Date().toDateString();
  showSpinner = false;
  pipelineData: any[] = [];
  displayText = "Uploading file...";
  currentStep = 1;
  pipelineId: any;
  faCsv = faFileCsv;
  faPython = faPython;
  originalDatasetFileName: any;
  originalPluginFileName: any;

  @ViewChild("datasetComponent") datasetComponent: DatasetSelectionComponent | undefined;
  @ViewChild("pluginComponent") pluginComponent: PluginSelectionComponent | undefined;

  constructor(
    private apiService: APIService,
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((qp: any) => {
      this.pipelineId = qp.uuid;
    });
  }

  checkPipelineStatus(id: string) {
    this.apiService.GetPipelineById(id).then((status: any) => {
      this.pipelineData = this.pipelineData.map((pd) => {
        if (pd.Id === id) {
          pd.PipelineStatus = status;
        }
        return pd;
      });
    });
  }

  async createPipeline() {
    this.displayText = "Creating Pipeline...";
    this.showSpinner = true;
    const userInfo = await Auth.currentUserInfo();
    const userName = userInfo.username.split('@')[0];
    let pipelineId = this.pipelineId ?? uuidv4();
    pipelineId = pipelineId.split("-")[0];
    const csvKey = `${userName}/${pipelineId}/raw_dataset.csv`;
    const pluginKey = `${userName}/${pipelineId}/processing_plugin.py`;
    const statusUpdatedAt = new Date().toISOString();
    const pipelineReq: PipelineRequestInput = {
      Id: pipelineId,
      StatusUpdatedAt: statusUpdatedAt,
      PipelineStatus: 'UPLOADED_DATASET',
      OriginalDatasetName: this.datasetComponent?.file ? this.datasetComponent?.file.name : this.datasetComponent?.s3Uri?.substr(this.datasetComponent?.s3Uri.lastIndexOf('/') + 1),
      OriginalPluginName: this.pluginComponent?.plugin ? this.pluginComponent?.plugin.name : 'default_processing_plugin.py',
    };
    const observables: any[] = [];
    if (!this.pluginComponent?.existingPlugin && !this.pluginComponent?.s3Uri) observables.push(this.dataService.getSignedUrl(pluginKey));
    if (this.datasetComponent?.datasetSelectionTab === 1) observables.push(this.dataService.getSignedUrl(csvKey));

    if (observables.length) {
      forkJoin(observables).subscribe({
        next: (signedURLS: any[]) => {
          this.router.navigate(["/tracker", pipelineId]).then(() => {
            const pluginObservable = [];
            if (this.pluginComponent?.existingPlugin) {
              pluginObservable.push(this.dataService.copyFile('', pluginKey, 'Y'));
            } else if (this.pluginComponent?.s3Uri) {
              pluginObservable.push(this.dataService.copyFile(this.pluginComponent?.s3Uri, pluginKey, 'Y'));
            } else {
              pluginObservable.push(this.dataService.uploadFile(signedURLS[0], this.pluginComponent?.plugin, "text/x-python"));
            }
            forkJoin(pluginObservable).subscribe(() => {
              const signedUrl = this.pluginComponent?.plugin ? signedURLS[1] : signedURLS[0];
              const datasetObservable = [
                  this.datasetComponent?.datasetSelectionTab === 1 ?
                      this.dataService.uploadFile(signedUrl, this.datasetComponent?.file, "text/csv") :
                      this.dataService.copyFile(this.datasetComponent?.s3Uri, csvKey)
              ];
              forkJoin(datasetObservable).subscribe(() => {
                this.apiService.Pipeline(pipelineReq).then();
              });
            });
          });
      },
      error: ()=> this.showSpinner = false
    });
    } else {
      this.router.navigate(["/tracker", pipelineId]).then(() => {
        this.dataService.copyFile('', pluginKey, 'Y').subscribe(() => {
          this.dataService.copyFile(this.datasetComponent?.s3Uri, csvKey).subscribe(() => {
            this.apiService.Pipeline(pipelineReq).then();
          })
        })
      });
    }
  }

  disableStep(): boolean {
    let disable = true;
    if (this.currentStep === 1 && this.datasetComponent) {
      disable = !this.datasetComponent.file && !this.datasetComponent.s3Uri;
    } else if (this.currentStep === 2 && this.pluginComponent) {
      disable = !this.pluginComponent.plugin && !this.pluginComponent.s3Uri && !this.pluginComponent.existingPlugin;
    }
    return disable;
  }

  getDatasetFileName() {
    if (this.datasetComponent?.file) {
      this.originalDatasetFileName = this.datasetComponent?.file.name;
    } else if (this.datasetComponent?.s3Uri) {
     this.originalDatasetFileName = this.datasetComponent?.s3Uri?.substring(this.datasetComponent?.s3Uri.lastIndexOf('/') + 1);
    }
  }

  getPluginFileName() {
    if (this.pluginComponent?.plugin) {
      this.originalPluginFileName = this.pluginComponent.plugin.name;
    } else if (this.pluginComponent?.s3Uri) {
      this.originalPluginFileName = this.pluginComponent?.s3Uri?.substring(this.pluginComponent?.s3Uri.lastIndexOf('/') + 1);
    } else if (this.pluginComponent?.existingPlugin) {
      this.originalPluginFileName = 'default_processing_plugin.py';
    }
  }
}
