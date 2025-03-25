import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, Input, LOCALE_ID, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO, ImportLogItemDetailDbVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';
import xmlFormat from 'xml-formatter';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'pure-import-item-log',
  standalone: true,
  imports: [
    CommonModule,
    SeparateFilterPipe,
    NgbCollapseModule
  ],
  templateUrl: './import-item-log.component.html'
})
export class ImportItemLogComponent implements OnInit {
  @Input() detail?: ImportLogItemDetailDbVO;

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  importMessageTranslations = {};

  isCollapsed: boolean = true;
  isScrolled = false;

  BOM = '239,187,191';

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

  firstContentFrom(message: string): string {
    message = message.replace('null', '').slice(0, 80);

    if (message.indexOf('\n') > 0) {
      message = message.slice(0, message.indexOf('\n'));
    } else if (message.indexOf('\n') === 0) {
      message = message.slice(1, message.indexOf('\n', 1));
    }

    if (message.indexOf(this.BOM) === 0) {
      message = message.slice(0, message.lastIndexOf(',') + 1) + '...';
    }

    return message;
  }

  moreContentFrom(message: string): string {
    message = message.replace('null', '');
    if (message.lastIndexOf('\n') === message.length - 1) message = message.slice(0, -1);
    if (message.indexOf('\n') === 0) message = message.slice(message.indexOf('\n', 1));

    if (message.search("Exception") >= 0) {
      message = message.replaceAll('(', ' (');
    }
    if (message.search("xml") >= 0) {
      return this.formatFromXml(message.slice(message.indexOf('\n') + 1));
    }
    if (message.indexOf(this.BOM) === 0) {
      return this.formatFromBytes(message.slice(message.indexOf(',', 75) + 1));
    }

    return message.slice(message.indexOf('\n') + 1);
  }

  formatFromXml(message: string): string {
    return xmlFormat(message, {
      indentation: '    ',
      collapseContent: true,
      throwOnFailure: false
    });
  }

  formatFromBytes(message: string): string {
    /* To make it readable:
    let readableMessage = String.fromCharCode(...(message.replace(this.BOM, '')).split(',').map(Number));
    return readableMessage;
    */
    return message.replaceAll(',', ', ');
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}