import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportErrorLevel, ImportLogDbVO, ImportLogItemDbVO } from 'src/app/model/inge';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { MessageService } from 'src/app/shared/services/message.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";
import { ImportDetailLogComponent } from "./import-detail-log/import-detail-log.component";

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

import { LocalizeDatePipe } from "src/app/shared/services/pipes/localize-date.pipe";

@Component({
  selector: 'pure-import-details-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltip,
    PaginatorComponent,
    ImportDetailLogComponent,
    TranslatePipe,
    LocalizeDatePipe
  ],
  templateUrl: './import-details-list.component.html'
})
export default class ImportDetailsListComponent implements OnInit {
  importsSvc = inject(ImportsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  msgSvc = inject(MessageService);
  translateSvc = inject(TranslateService);

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

  isScrolled = false;

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

  doDelete(): void {
    let ref = this.msgSvc.displayConfirmation({ text: this.translateSvc.instant(_('imports.remove.confirmation')), confirm: this.translateSvc.instant(_('common.confirm')), cancel: this.translateSvc.instant(_('common.cancel')) });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.importsSvc.deleteImportedItems(this.import.id).subscribe(importsResponse => {
          console.log(importsResponse);
          const msg = this.translateSvc.instant(_('imports.list.details.delete')) + ' ' + this.translateSvc.instant(_('common.completed')) + '!\n';
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
    let ref = this.msgSvc.displayConfirmation({ text: this.translateSvc.instant(_('imports.submit.confirmation')), confirm: this.translateSvc.instant(_('common.confirm')), cancel: this.translateSvc.instant(_('common.cancel')) });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        let submitModus = 'SUBMIT';
        this.importsSvc.submitImportedItems(this.import.id, submitModus).subscribe(importsResponse => {
          console.log(importsResponse);
          const msg = this.translateSvc.instant(_('imports.list.details.submit')) + ' ' + this.translateSvc.instant(_('common.completed')) + '!\n';
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
    let ref = this.msgSvc.displayConfirmation({ text: this.translateSvc.instant(_('imports.release.confirmation')), confirm: this.translateSvc.instant(_('common.confirm')), cancel: this.translateSvc.instant(_('common.cancel')) });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        let submitModus = this.caseSubmitAndRelease() ? 'SUBMIT_AND_RELEASE' : 'RELEASE';
        this.importsSvc.submitImportedItems(this.import.id, submitModus).subscribe(importsResponse => {
          console.log(importsResponse);
          const msg = this.translateSvc.instant(_('imports.list.details.release')) + ' ' + this.translateSvc.instant(_('common.completed')) + '!\n';
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
    this.isScrolled = scrollPosition > 20 ? true : false;
  }

}
