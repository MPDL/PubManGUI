import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO, ImportLogItemDetailDbVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';
import xmlFormat from 'xml-formatter';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


@Component({
  selector: 'pure-import-log-item-details',
  standalone: true,
  imports: [
    CommonModule,
    SeparateFilterPipe,
    NgbCollapseModule,
    PaginatorComponent
  ],
  templateUrl: './details.component.html'
})
export default class DetailsComponent implements OnInit {

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);
  
  currentPage = this.importsSvc.lastPageNumFrom().log;

  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogItemDetailDbVO[] = [];
  logs: ImportLogItemDetailDbVO[] = [];

  item: ImportLogItemDbVO | undefined;

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  
  isCollapsed: boolean[] = [];
  isScrolled = false;

  BOM = '239,187,191';

  constructor(
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    this.item = history.state.item;

    this.importsSvc.getImportLogItemDetails(Number(this.item?.id))
      .subscribe(importsResponse => {
        if (importsResponse.length === 0) {
          const msg = $localize`:@@imports.list.details.empty:This detail has no logs available!` + '\n';
          this.msgSvc.info(msg);       
          return this.router.navigate(['/imports/myimports/', this.item?.parent.id]);
        }
        importsResponse.sort((a, b) => a.id - b.id);
          
        this.logs = importsResponse;
        this.collectionSize = this.logs.length;
        this.isCollapsed = new Array<boolean>(this.logs.length).fill(true);

        this.refreshLogs();
        return;
      }
    );

    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
      })
    }
  }

  firstContentFrom(message: string): string {
    message = message.replace('null', '').slice(0, 80);

    if (message.indexOf('\n') > 0) {
      message = message.slice(0, message.indexOf('\n'));
    } else if (message.indexOf('\n') === 0) {
      message = message.slice(1, message.indexOf('\n',1));
    }
    
    if (message.indexOf(this.BOM) === 0) {
      message = message.slice(0, message.lastIndexOf(',')+1) + '...';
    }

    return message;
  }

  moreContentFrom(message: string):string {
    message = message.replace('null', '');
    if (message.lastIndexOf('\n') === message.length-1) message = message.slice(0, -1);
    if (message.indexOf('\n') === 0) message = message.slice(message.indexOf('\n',1));

    if (message.search("Exception") >= 0) {
      message = message.replaceAll('(', ' (');
    }
    if (message.search("xml") >= 0) {
      return this.formatFromXml(message.slice(message.indexOf('\n')+1));
    } 
    if (message.indexOf(this.BOM) === 0 ) {
      return this.formatFromBytes(message.slice(message.indexOf(',',75)+1));
    }

    return message.slice(message.indexOf('\n')+1);
  }

  formatFromXml(message: string):string {
    return xmlFormat(message, {
      indentation: '    ',
      collapseContent: true,
      throwOnFailure: false
    });
  }

  formatFromBytes(message: string):string {
    /* To make it readable:
    let readableMessage = String.fromCharCode(...(message.replace(this.BOM, '')).split(',').map(Number));
    return readableMessage;
    */
    return message.replaceAll(',', ', ');
  }

  refreshLogs() {
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + this.pageSize,
    );
    this.importsSvc.lastPageNumFrom().log = this.currentPage;
  }

  getPreferredPageSize():number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize;
  }

  getImportStatusTranslation(txt: string):string {
    let key = txt as keyof typeof this.importStatusTranslations;
    return this.importStatusTranslations[key];
  }

  getImportErrorLevelTranslation(txt: string):string {
    let key = txt as keyof typeof this.importErrorLevelTranslations;
    return this.importErrorLevelTranslations[key];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}