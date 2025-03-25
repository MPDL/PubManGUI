import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, Input, LOCALE_ID, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO } from 'src/app/model/inge';

import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';


@Component({
  selector: 'pure-detail-log',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './import-detail-log.component.html'
})
export class ImportDetailLogComponent implements OnInit {
    @Input() item?: ImportLogItemDbVO;

  importsSvc = inject(ImportsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  msgSvc = inject(MessageService);

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  importMessageTranslations = {};

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importMessageTranslations = msgs.ImportMessage;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importMessageTranslations = msgs.ImportMessage;
      })
    }
  }

  getImportStatusTranslation(txt: string): string {
    let key = txt as keyof typeof this.importStatusTranslations;
    return this.importStatusTranslations[key];
  }

  getImportErrorLevelTranslation(txt: string): string {
    let key = txt as keyof typeof this.importErrorLevelTranslations;
    return this.importErrorLevelTranslations[key];
  }

  getImportMessageTranslation(txt: string): string {
    let key = txt as keyof typeof this.importMessageTranslations;
    return this.importMessageTranslations[key];
  }

  getAssorted(txt: string): string {
    switch (txt) {
      case 'FINE':
      case 'WARNING':
      case 'FATAL':        
        return txt;
      default:
        return 'ERROR';
    }
  }

}