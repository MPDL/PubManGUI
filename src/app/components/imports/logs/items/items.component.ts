import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from '../../services/imports.service';
import { ImportLogItemDbVO, ImportErrorLevel } from 'src/app/model/inge';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/imports/pipes/stateFilter.pipe';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';

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
    SeparateFilterPipe,
    PaginatorComponent
  ],
  templateUrl: './items.component.html'
})
export default class ItemsComponent implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogItemDbVO[] = [];
  logs: ImportLogItemDbVO[] = [];

  import: string | undefined;
  started: Date | undefined;
  
  itemsCount: number = 0;
  itemsFine: number = 0;
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


  isScrolled = false;  

  constructor(
    private importsSvc: ImportsService,
    private activatedRoute: ActivatedRoute,
    private router: Router, 
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) { }


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
              if (element.errorLevel === ImportErrorLevel.FINE) {
                this.itemsFine++;
              }
              this.itemsCount++;
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
        this.refreshLogs();
        return;
      }
    );

    //this.loadTranslations(this.locale);

    this.import = history.state.import;
    this.started = history.state.started;
  }

  itemHasError(errorLevel: ImportErrorLevel):boolean {
    if( errorLevel === ImportErrorLevel.PROBLEM 
      || errorLevel === ImportErrorLevel.ERROR 
      || errorLevel === ImportErrorLevel.FATAL) {
        return true;
      }
    return false;
  }

  itemHasWarning(errorLevel: ImportErrorLevel):boolean {
    if( errorLevel === ImportErrorLevel.WARNING) {
        return true;
      }
    return false;
  }

  refreshLogs() {
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
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

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}