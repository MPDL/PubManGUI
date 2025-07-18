import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDetailDbVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/services/message.service';

import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';
import xmlFormat from 'xml-formatter';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'pure-import-item-log',
  standalone: true,
  imports: [
    CommonModule,
    SeparateFilterPipe,
    NgbCollapseModule,
    TranslatePipe
  ],
  templateUrl: './import-item-log.component.html'
})
export class ImportItemLogComponent {
  @Input() detail?: ImportLogItemDetailDbVO;

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);
  translateService = inject(TranslateService);

  isCollapsed: boolean = true;
  isScrolled = false;

  BOM = '239,187,191';

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

  hasTranslation(key: string): boolean {
    if ((key.split('\n').length) > 1
      || (this.translateService.instant(_('ImportMessage.' + key)) === 'ImportMessage.' + key)) return false;

    return true;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }

}
