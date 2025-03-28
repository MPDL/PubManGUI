import { CommonModule } from '@angular/common';
import { Component, Input, inject, Inject, LOCALE_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";


@Component({
  selector: 'pure-batch-action-dataset-log',
  imports: [
    CommonModule,
    RouterLink,
    SanitizeHtmlPipe,
  ],
  templateUrl: './batch-action-dataset-log.component.html',
})
export class BatchActionDatasetLogComponent {
  @Input() log?: resp.BatchProcessLogDetailDbVO;

  batchSvc = inject(BatchService);

  batchProcessLogDetailStateTranslations = {};
  batchProcessMessageTranslations = {};
  batchProcessMethodTranslations = {};

  title = '';

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

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

    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    }
  }

  getProcessLogDetailStateTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessLogDetailStateTranslations;
    return this.batchProcessLogDetailStateTranslations[key];
  }

  getProcessMessageTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMessageTranslations;
    return this.batchProcessMessageTranslations[key];
  }

  getProcessMethodTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
  }

}
