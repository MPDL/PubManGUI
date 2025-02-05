import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from '../../services/imports.service';
import { ImportLogItemDbVO, ImportErrorLevel } from 'src/app/model/inge';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/imports/pipes/stateFilter.pipe';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";

@Component({
  selector: 'pure-import-log-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    NgbTooltip,
    StateFilterPipe,
    PaginatorComponent
  ],
  templateUrl: './items.component.html'
})
export default class ItemsComponent implements OnInit {

  importsSvc = inject(ImportsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  currentPage = this.importsSvc.lastPageNumFrom().details;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogItemDbVO[] = [];
  logs: ImportLogItemDbVO[] = [];

  import: string | undefined;
  started: Date | undefined;
  format: string | undefined;
  
  itemsFailed: number = 0;
  itemsImported: number = 0;
  error: number = 0;
  fatal: number = 0;
  fine: number = 0;
  problem: number = 0;
  warning: number = 0;

  public filterForm: FormGroup = this.fb.group({
    fine: [true, Validators.requiredTrue],
    warning: [true, Validators.requiredTrue],
    problem: [true, Validators.requiredTrue],
    error: [true, Validators.requiredTrue],
    fatal: [true, Validators.requiredTrue],  
  });

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  importMessageTranslations = {};

  isScrolled = false;  

  constructor(
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.importsSvc.getImportLogItems(id)),
      )
      .subscribe(importsResponse => {
        if (importsResponse.length === 0) return this.router.navigate(['/import/myimports']);

        importsResponse.sort((a, b) => a.id - b.id)
          .forEach(element => {
            if (element.itemId) {
              this.itemsImported++;
            } else if (element.message.includes("item")) {
              this.itemsFailed++;
            }
            switch (element.errorLevel) {
              case ImportErrorLevel.FINE:
                this.fine++;
                break;
              case ImportErrorLevel.WARNING:
                this.warning++;
                break;
              case ImportErrorLevel.PROBLEM:
                this.problem++;
                break;
              case ImportErrorLevel.ERROR:
                this.error++;
                break;
              case ImportErrorLevel.FATAL:
                this.fatal++;
                break;
            }
          });
        this.logs = importsResponse;
        this.collectionSize = this.logs.length;
        this.import = this.logs[0].parent.name;
        this.started = this.logs[0].parent.startDate;
        this.format = this.logs[0].parent.format;
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

  getAssorted(txt: string):string {
    switch(txt) {
      case 'FINE':
      case 'WARNING':
        return txt;
      default:
        return 'ERROR';
    }
  }

  refreshLogs() {
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + this.pageSize,
    );
    this.importsSvc.lastPageNumFrom().details = this.currentPage;
  }

  getPreferredPageSize():number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize;
  }

  refreshFilters():ImportErrorLevel[] {
    const filteredStatus = [];
    if (this.filterForm.get('fine')?.value) {
      filteredStatus.push(ImportErrorLevel.FINE);
    } else 
    if (this.filterForm.get('warning')?.value) {
      filteredStatus.push(ImportErrorLevel.WARNING);
    }
    if (this.filterForm.get('problem')?.value) {
      filteredStatus.push(ImportErrorLevel.PROBLEM); 
    }
    if (this.filterForm.get('error')?.value) {
      filteredStatus.push(ImportErrorLevel.ERROR);
    }
    if (this.filterForm.get('fatal')?.value) {
      filteredStatus.push(ImportErrorLevel.FATAL);
    }
    return filteredStatus;
  }

  getImportStatusTranslation(txt: string):string {
    let key = txt as keyof typeof this.importStatusTranslations;
    return this.importStatusTranslations[key];
  }

  getImportErrorLevelTranslation(txt: string):string {
    let key = txt as keyof typeof this.importErrorLevelTranslations;
    return this.importErrorLevelTranslations[key];
  }

  getImportMessageTranslation(txt: string):string {
    let key = txt as keyof typeof this.importMessageTranslations;
    return this.importMessageTranslations[key];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}