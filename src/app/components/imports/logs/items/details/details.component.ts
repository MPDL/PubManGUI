import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO, ImportLogItemDetailDbVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';

import xmlFormat from 'xml-formatter';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


@Component({
  selector: 'pure-import-log-item-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SeparateFilterPipe,
    NgbCollapseModule,
    PaginatorComponent
  ],
  templateUrl: './details.component.html'
})
export default class DetailsComponent implements OnInit {

  currentPage = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogItemDetailDbVO[] = [];
  logs: ImportLogItemDetailDbVO[] = [];

  item: ImportLogItemDbVO | undefined;

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  
  isCollapsed: boolean[] = [];
  isScrolled = false;

  constructor(
    private importsSvc: ImportsService,
    private msgSvc: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.item = history.state.item;
    this.importsSvc.getImportLogItemDetails(Number(this.item?.id))
      .subscribe(importsResponse => {
        if (importsResponse.length === 0) {
          const msg = `This item has no details available!\n`;
          this.msgSvc.info(msg);
  
          return this.router.navigate(['/imports/myimports/', this.item?.parent.id], {state:{ import: this.item?.parent.name, started: this.item?.parent.startDate }});
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

  formatXml(message: string):string {
    return xmlFormat(message, {
      indentation: '    ',
      collapseContent: true,
      throwOnFailure: false
    });
  }

  refreshLogs() {
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + this.pageSize,
    );
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