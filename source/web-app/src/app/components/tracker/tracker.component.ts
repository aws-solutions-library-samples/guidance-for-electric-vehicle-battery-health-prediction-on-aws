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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {APIService} from "../../services/api.service";
import {faBug} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-tracker',
    templateUrl: './tracker.component.html',
    styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {

    @Input() id: any;
    @Output() completionNotifier = new EventEmitter<boolean>();
    pipelineId: any;
    pipelineData: any = {};
    pipelineStatus: any;
    availableSteps = [
        {id: 1, title: 'Uploading Dataset', status: 'UPLOADING_DATASET', timeInMs: 0},
        {id: 2, title: 'Processing Dataset', status: 'PROCESSING_DATASET', timeInMs: 0},
        {id: 3, title: 'Importing Dataset', status: 'IMPORTING_DATASET', timeInMs: 0},
        {id: 4, title: 'Training Predictor', status: 'TRAINING_PREDICTOR', timeInMs: 0},
        {id: 5, title: 'Generating Forecast', status: 'GENERATING_FORECAST', timeInMs: 0},
        {id: 6, title: 'Exporting Predictions', status: 'EXPORTING_PREDICTIONS', timeInMs: 0},
        {id: 7, title: 'Cleaning Exports', status: 'CLEANING_EXPORTS', timeInMs: 0},
        {id: 8, title: 'Pipeline Finished', status: 'PIPELINE_FINISHED', timeInMs: 0, hide: true},
    ];
    currentStep = 1;
    showError = false;
    faBug = faBug;

    constructor(private activatedRoute: ActivatedRoute, private apiService: APIService, private router: Router) {
        this.activatedRoute.params.subscribe((path: any) => {
            if (path.id) {
                this.pipelineId = path.id;
            }
        });
    }

    ngOnInit(): void {
        if (!this.pipelineId)
            this.pipelineId = this.id;
        this.getPipelineInfo();
        this.apiService.PipelineSubListener.subscribe((pipelineData: any) => {
            if (pipelineData && pipelineData.value.data.pipelineSub?.Id === this.pipelineId) {
                this.pipelineStatus = pipelineData.value.data.pipelineSub?.PipelineStatus;
                this.currentStep = (this.availableSteps.find((step: any) => step.status === this.pipelineStatus)?.id ?? this.currentStep);
                if (this.pipelineStatus === 'PIPELINE_FINISHED') {
                    if (this.id) {
                        this.completionNotifier.emit(true);
                    }
                    this.router.navigate(['/dashboard'], {queryParams: {uuid: this.pipelineId}}).then();
                } else {
                    this.getPipelineInfo();
                }
            }
        }, (err) => {
            this.showError = true;
            console.log(err);
        });
    }

    getPipelineInfo() {
        try {
            this.apiService.GetPipelineById(this.pipelineId).then((pipeline: any) => {
                this.pipelineData = pipeline;
                this.pipelineStatus = pipeline.PipelineStatus;
                this.currentStep = (this.availableSteps.find((step: any) => step.status === this.pipelineStatus)?.id ?? this.currentStep);
                if (this.pipelineStatus === 'PIPELINE_FINISHED') {
                    this.router.navigate(['/dashboard'], {queryParams: {uuid: this.pipelineId}}).then();
                }
            }).catch(() => console.log("Pipeline is being initialized"));
        } catch (err) {
            console.log("Pipeline is being initialized")
        }
    }

    calculateTime(stepId: number): any {
        if (this.pipelineData) {
            switch (stepId) {
                case 1: {
                    return this.calculateTimeDiff(this.pipelineData.DataUploadedAt, this.pipelineData.PluginUploadedAt, 1);
                }
                case 2: {
                    return this.calculateTimeDiff(this.pipelineData.ProcFinishedAt, this.pipelineData.PluginUploadedAt, 2);
                }
                case 3: {
                    return this.calculateTimeDiff(this.pipelineData.DataImportedAt, this.pipelineData.ProcFinishedAt, 3);
                }
                case 4: {
                    return this.calculateTimeDiff(this.pipelineData.TrainingFinishedAt, this.pipelineData.DataImportedAt, 4);
                }
                case 5: {
                    return this.calculateTimeDiff(this.pipelineData.ForecastGeneratedAt, this.pipelineData.TrainingFinishedAt, 5);
                }
                case 6: {
                    return this.calculateTimeDiff(this.pipelineData.ForecastExportedAt, this.pipelineData.ForecastGeneratedAt, 6)
                }
                case 7: {
                    return this.calculateTimeDiff(this.pipelineData.CleaningFinishedAt, this.pipelineData.ForecastExportedAt, 7)
                }
            }
        }
    }

    calculateTimeDiff(currentStepTime: any, previousStepTime: any, step: number): any {
        if (!currentStepTime || !previousStepTime) return;
        const startTime: any = new Date(previousStepTime);
        const endTime: any = new Date(currentStepTime);
        let duration = (endTime.getTime() - startTime.getTime());
        if (step !== 1) {
            duration += this.availableSteps[step - 1].timeInMs;
        }
        this.availableSteps[step].timeInMs = duration;
        let seconds: any = Math.floor((duration / 1000) % 60),
            minutes: any = Math.floor((duration / (1000 * 60)) % 60),
            hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }
}
