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

import {Component, OnInit} from '@angular/core';
import {APIService, GetPipelinesByUserQuery} from "../../services/api.service";
import {PipelineStatus} from "../../models/pipeline-status";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {Router} from "@angular/router";
import {Auth} from "aws-amplify";

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
    styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    pipelineData: GetPipelinesByUserQuery[] = [];
    segmentedPipelineData: any[] = [];
    emptyRows: any[] = [];
    availableSteps = [
        {id: 1, title: 'CSV Dataset Uploaded', status: 'DATASET_UPLOADED'},
        {id: 2, title: 'Processing Dataset', status: 'PROCESSING_DATASET'},
        {id: 3, title: 'Importing Dataset', status: 'IMPORTING_DATASET'},
        {id: 4, title: 'Training Predictor', status: 'TRAINING_PREDICTOR'},
        {id: 5, title: 'Generating Forecasts', status: 'GENERATING_FORECASTS'},
        {id: 6, title: 'Exporting Predictions', status: 'EXPORTING_PREDICTIONS'},
        {id: 7, title: 'Cleaning Exports', status: 'CLEANING_EXPORTS'},
    ];
    currentStep = 1;
    faLeft = faChevronLeft;
    faRight = faChevronRight;
    itemsPerPage = 10;
    currentPage = 1;
    totalPages = 1;
    lastShownIndex = this.itemsPerPage;
    showSpinner = false;

    constructor(private apiService: APIService, private router: Router) {
    }

    ngOnInit(): void {
        this.showSpinner = true;
        Auth.currentUserInfo().then(user => {
            const username = user.username.split('@')[0];
            this.apiService.GetPipelinesByUser(username).then((data: GetPipelinesByUserQuery[]) => {
                this.pipelineData = data.map(d => {
                    // @ts-ignore
                    d.currentStep = PipelineStatus[d.PipelineStatus];
                    return d;
                }).sort((d1: GetPipelinesByUserQuery, d2: GetPipelinesByUserQuery) => {
                    return new Date(String(d2.DataUploadedAt)).getTime() - new Date(String(d1.DataUploadedAt)).getTime()
                });
                this.segmentedPipelineData = this.pipelineData.slice(0, this.itemsPerPage);
                if (this.segmentedPipelineData.length) {
                    this.createEmptyRows();
                }
                this.totalPages = Math.ceil(this.pipelineData.length / this.itemsPerPage);
                this.showSpinner = false;
            });
        });

    }

    updatePagination() {
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.pipelineData.length / this.itemsPerPage);
        this.segmentedPipelineData = this.pipelineData.slice(0, this.itemsPerPage);
        this.lastShownIndex = this.itemsPerPage;
        this.createEmptyRows();
    }

    goBack() {
        if (this.currentPage !== 1) {
            this.currentPage--;
            this.segmentedPipelineData = this.pipelineData.slice(this.lastShownIndex - (this.itemsPerPage * 2), this.lastShownIndex -= this.itemsPerPage);
            this.emptyRows = [];
        }
    }

    goNext() {
        if (this.currentPage !== this.totalPages) {
            this.currentPage++;
            this.segmentedPipelineData = this.pipelineData.slice(this.lastShownIndex, this.lastShownIndex += this.itemsPerPage);
            this.createEmptyRows();
        }
    }

    navigateToTracker(pipeline: any) {
        if (pipeline.currentStep < 7) {
            this.router.navigate(['/tracker', pipeline.Id]).then();
        } else {
            this.router.navigate(['/dashboard'],{queryParams: {uuid: pipeline.Id}}).then();
        }
    }

    private createEmptyRows() {
        if (this.segmentedPipelineData.length < this.itemsPerPage) {
            this.emptyRows = new Array(this.itemsPerPage - this.segmentedPipelineData.length);
        } else {
            this.emptyRows = [];
        }
    }
}
