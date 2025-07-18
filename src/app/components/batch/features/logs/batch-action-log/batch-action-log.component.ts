import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { MatBadgeModule } from '@angular/material/badge';

import { TranslatePipe } from "@ngx-translate/core";
import { LocalizeDatePipe } from "src/app/pipes/localize-date.pipe";


type detail = {
  'item': resp.BatchProcessLogDetailDbVO,
  'title': string
}

@Component({
  selector: 'pure-batch-action-log',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatBadgeModule,
    TranslatePipe,
    LocalizeDatePipe
  ],
  templateUrl: './batch-action-log.component.html'
})

export class BatchActionLogComponent {
  @Input() log?: resp.BatchProcessLogHeaderDbVO;

  batchSvc = inject(BatchService);

  state = resp.BatchProcessLogHeaderState;

  detailLogs: detail[] = [];

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

}
