import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ImportsService } from '../../services/imports.service';
import { ImportLogItemDbVO, ImportErrorLevel, ImportLogDbVO } from 'src/app/model/inge';

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
  unfilteredLogs: ImportLogItemDbVO[] = [];
  logs: ImportLogItemDbVO[] = [];

  import!: ImportLogDbVO;

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

  executeOnceTimeout = false;

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  importMessageTranslations = {};
  importFormatTranslations = {};

  isScrolled = false;

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(value => {
      this.import = value['import'];
    });

    if (this.import.id) {
      this.importsSvc.getImportLogItems(Number(this.import.id))
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
          this.logs = this.unfilteredLogs = importsResponse;
          this.collectionSize = this.logs.length;

          this.refreshLogs();
          return;
        });
    }

    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importMessageTranslations = msgs.ImportMessage;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importMessageTranslations = msgs.ImportMessage;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    }
  }

  getAssorted(txt: string): string { // para la agrupación antes de traducir
    switch (txt) {
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

  getPreferredPageSize(): number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize || 25;
  }

  refreshFilters(): ImportErrorLevel[] { // comprobamos que filtros están seleccionados
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

  onFilterChange(): void {
    var activeFilters = this.refreshFilters();
    if (!this.executeOnceTimeout) {
      this.executeOnceTimeout = true;
      setTimeout(() => {
        this.logs = this.unfilteredLogs.filter(item => activeFilters.includes(item.errorLevel));
        //this.collectionSize = this.logs.length;
        this.refreshLogs();

        this.executeOnceTimeout = false;
      }, 100); 
    };
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

  getImportFormatTranslation(txt: string): string {
    let key = txt as keyof typeof this.importFormatTranslations;
    return this.importFormatTranslations[key];
  }

  doDelete(): void {
    console.log('Delete done');
    // TO DO
  }

  doSet(): void {
    console.log('Set done');
    // TO DO
  }

  doRelease(): void {
    console.log('Release done');
    // TO DO
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}