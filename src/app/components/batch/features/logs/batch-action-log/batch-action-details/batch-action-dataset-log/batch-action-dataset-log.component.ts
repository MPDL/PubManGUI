import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { SanitizeHtmlPipe } from "src/app/pipes/sanitize-html.pipe";
import { TranslatePipe } from "@ngx-translate/core";

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'pure-batch-action-dataset-log',
  imports: [
    CommonModule,
    RouterLink,
    SanitizeHtmlPipe,
    TranslatePipe,
    NgbTooltip
  ],
  templateUrl: './batch-action-dataset-log.component.html',
})
export class BatchActionDatasetLogComponent {
  @Input() log?: resp.BatchProcessLogDetailDbVO;

  batchSvc = inject(BatchService);
  logDetailState: typeof resp.BatchProcessLogDetailState = resp.BatchProcessLogDetailState;

  title = '';

  ngOnInit(): void {

    this.batchSvc.getItem(this.log!.itemObjectId)
      .subscribe({
        next: (value) => {
          this.title = value.metadata?.title;
        },
        error: () => {
          this.title = '404';
        }
      });
  }

}
