import { CommonModule } from '@angular/common';
import { Component, Input, inject, Inject, LOCALE_ID } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";


type detail = {
  'item': resp.BatchProcessLogDetailDbVO,
  'title': string
}

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
  @Input() log?: detail;

  batchSvc = inject(BatchService);

  batchProcessLogDetailStateTranslations = {};
  batchProcessMessageTranslations = {};
  batchProcessMethodTranslations = {};

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    console.log(this.log);
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
