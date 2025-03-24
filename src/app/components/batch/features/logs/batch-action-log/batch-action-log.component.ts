import { CommonModule } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { MatBadgeModule } from '@angular/material/badge';


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
    MatBadgeModule
  ],
  templateUrl: './batch-action-log.component.html'
})

export class BatchActionLogComponent {
  @Input() log?: resp.BatchProcessLogHeaderDbVO;

  batchSvc = inject(BatchService);

  state = resp.BatchProcessLogHeaderState;
  batchProcessLogHeaderStateTranslations = {};
  batchProcessMethodTranslations = {};
  detailLogs: detail[] = [];

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogHeaderStateTranslations = msgs.BatchProcessLogHeaderState;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogHeaderStateTranslations = msgs.BatchProcessLogHeaderState;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    }
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

  getProcessLogHeaderStateTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessLogHeaderStateTranslations;
    return this.batchProcessLogHeaderStateTranslations[key];
  }

  getProcessMethodTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
  }

}
