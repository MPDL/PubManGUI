import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ImportsService } from '../../services/imports.service';
import { ImportLogItemDbVO, ImportErrorLevel, ImportLogDbVO } from 'src/app/model/inge';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { StateFilterPipe } from 'src/app/components/imports/pipes/stateFilter.pipe';

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
    // StateFilterPipe,
    PaginatorComponent
  ],
  templateUrl: './items.component.html'
})
export default class ItemsComponent implements OnInit {
  importsSvc = inject(ImportsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  msgSvc = inject(MessageService);

  currentPage = this.importsSvc.lastPageNumFrom().details;
  pageSize = 25;
  inPage: ImportLogItemDbVO[] = [];

  unfilteredSize = 0;
  filteredSize = 0;
  unfilteredLogs: ImportLogItemDbVO[] = [];
  filteredLogs: ImportLogItemDbVO[] = [];

  import!: ImportLogDbVO;
  isStandardWorkflow: boolean = false;
  isSimpleWorkflow: boolean = false;

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

  activeFilters: ImportErrorLevel[] = [
    ImportErrorLevel.FINE,
    ImportErrorLevel.WARNING,
    ImportErrorLevel.PROBLEM,
    ImportErrorLevel.ERROR,
    ImportErrorLevel.FATAL
  ];

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
          if (importsResponse.length === 0) return this.router.navigate(['/imports/myimports']);

          importsResponse.sort((a, b) => a.id - b.id)
            .forEach(element => {
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
            
          this.filteredLogs = this.unfilteredLogs = importsResponse;
          this.filteredSize = this.unfilteredSize = this.unfilteredLogs.length;

          if (this.importsSvc.getLogFilters().length > 0) {
            if (this.activeFilters.length === this.importsSvc.getLogFilters().length
              && (this.activeFilters.every((element_1) =>
                this.importsSvc.getLogFilters().some((element_2) =>
                  Object.keys(element_1).every((key: any) => element_1[key] === element_2[key])
                )))) {
            } else {
              this.activeFilters = this.importsSvc.getLogFilters();
              this.filterForm.patchValue({
                fine: this.activeFilters.includes(ImportErrorLevel.FINE),
                warning: this.activeFilters.includes(ImportErrorLevel.WARNING),
                problem: this.activeFilters.includes(ImportErrorLevel.PROBLEM),
                error: this.activeFilters.includes(ImportErrorLevel.ERROR),
                fatal: this.activeFilters.includes(ImportErrorLevel.FATAL),
              });
              this.updateFilteredLogs();
            }
          }
          this.refreshLogs();
          return;
        });
      if (this.import.contextId) {
        this.importsSvc.getContexts(this.import.contextId)
          .subscribe(ctxRespoonse => {
            if (ctxRespoonse.workflow === "STANDARD") {
              this.isStandardWorkflow = true;
            } else {
              this.isStandardWorkflow = false;
              if (ctxRespoonse.workflow === "SIMPLE") {
                this.isSimpleWorkflow = true;
              } else {
                this.isSimpleWorkflow = false;
              }
            }
          })
      }
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

  refreshLogs() {
    this.currentPage = Math.ceil((this.currentPage * this.pageSize) / this.getPreferredPageSize());
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.filteredLogs.map((log, i) => ({ _id: i + 1, ...log })).slice(
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

  refreshFilters(): void {
    this.activeFilters = [];
    if (this.filterForm.get('fine')?.value) {
      this.activeFilters.push(ImportErrorLevel.FINE);
    }
    if (this.filterForm.get('warning')?.value) {
      this.activeFilters.push(ImportErrorLevel.WARNING);
    }
    if (this.filterForm.get('error')?.value) {
      this.activeFilters.push(ImportErrorLevel.ERROR);
      this.activeFilters.push(ImportErrorLevel.PROBLEM);
    }
    if (this.filterForm.get('fatal')?.value) {
      this.activeFilters.push(ImportErrorLevel.FATAL);
    }
  }

  saveFilters(): void {
    this.importsSvc.setLogFilters(this.activeFilters);
  }

  onFilterChange(): void {
    this.refreshFilters();
    this.saveFilters();

    if (!this.executeOnceTimeout) {
      this.executeOnceTimeout = true;
      setTimeout(() => {

        this.updateFilteredLogs();
        this.currentPage = 1;
        this.refreshLogs();

        this.executeOnceTimeout = false;
      }, 100);
    };
  }

  updateFilteredLogs(): void {
    this.filteredLogs = this.unfilteredLogs.filter(item => this.activeFilters.includes(item.errorLevel));
    this.filteredSize = this.filteredLogs.length;
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
    let ref = this.msgSvc.displayConfirmation({ text: $localize`:@@imports.remove.confirmation:Do you really want to remove this import?`, confirm: $localize`:@@confirm:Confirm`, cancel: $localize`:@@cancel:Cancel` });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.importsSvc.deleteImportedItems(this.import.id).subscribe(importsResponse => {
          console.log(importsResponse); 
          const msg = $localize`:@@imports.list.details.delete:Delete` + ' ' + $localize`:@@completed:completed` + '!\n';
          this.msgSvc.success(msg);   
          setTimeout(() => {
            this.router.navigate(['/imports/myimports']);
          }, 1000);
        })
      }
    });
  }

  caseSubmit(): boolean {
    if (!this.importsSvc.isModerator && this.importsSvc.isDepositor && this.isStandardWorkflow) {  
      return true;
    } else return false;
  }

  caseSubmitAndRelease(): boolean {
    if (this.importsSvc.isModerator && this.isStandardWorkflow) { 
      return true;
    } else return false;
  }

  caseRelease(): boolean {
    if (this.importsSvc.isModerator && this.isSimpleWorkflow) { 
      return true;
    } else return false;
  }

  doSubmit(): void {
    let ref = this.msgSvc.displayConfirmation({ text: $localize`:@@imports.submit.confirmation:Do you really want to submit this import?`, confirm: $localize`:@@confirm:Confirm`, cancel: $localize`:@@cancel:Cancel` });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        let submitModus = 'SUBMIT';
        this.importsSvc.submitImportedItems(this.import.id, submitModus).subscribe(importsResponse => {
          console.log(importsResponse);
          const msg = $localize`:@@imports.list.details.submit:Submit` + ' ' + $localize`:@@completed:completed` + '!\n';
          this.msgSvc.success(msg);  

          let element = document.getElementById('submit') as HTMLButtonElement;
          element.ariaDisabled = 'true';
          element.tabIndex=-1;
          element.classList.add('disabled');
        })
      }
    });
  }

  doRelease(): void {
    let ref = this.msgSvc.displayConfirmation({ text: $localize`:@@imports.release.confirmation:Do you really want to release this import?`, confirm: $localize`:@@confirm:Confirm`, cancel: $localize`:@@cancel:Cancel` });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        let submitModus = this.caseSubmitAndRelease() ? 'SUBMIT_AND_RELEASE' : 'RELEASE';
        this.importsSvc.submitImportedItems(this.import.id, submitModus).subscribe(importsResponse => {
          console.log(importsResponse);
          const msg = $localize`:@@imports.list.details.release:Release` + ' ' + $localize`:@@completed:completed` + '!\n';
          this.msgSvc.success(msg);  

          let element = document.getElementById('release') as HTMLButtonElement;
          element.ariaDisabled = 'true';
          element.tabIndex=-1;
          element.classList.add('disabled');

          console.log(`${submitModus} done`);
        })
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}