import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { ImportsService } from '../../services/imports.service';
import * as resp from '../../interfaces/imports-responses';

import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/imports/pipes/stateFilter.pipe';
import { SeparateFilterPipe } from 'src/app/components/imports/pipes/separateFilter.pipe';
import { ItemsService} from "src/app/services/pubman-rest-client/items.service";

import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";


const FILTER_PAG_REGEX = /[^0-9]/g;


@Component({
  selector: 'pure-import-log-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    RouterLink,
    NgbTooltip,
    StateFilterPipe,
    SeparateFilterPipe,
    //SanitizeHtmlPipe,
  ],
  templateUrl: './items.component.html'
})
export default class ItemsComponent implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.ImportLogItemDbVO[] = [];
  logs: resp.ImportLogItemDbVO[] = [];

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

  public importErrorLevel = resp.ImportErrorLevel;

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
              if (element.errorLevel === resp.ImportErrorLevel.FINE) {
                this.itemsFine++;
              }
              this.itemsCount++;
            }
            switch (element.errorLevel) {
              case resp.ImportErrorLevel.FINE:
                this.fine++;
                break;
              case resp.ImportErrorLevel.WARNING:
                this.warning++;
                break;
              case resp.ImportErrorLevel.PROBLEM:
                this.problem++;
                break;
              case resp.ImportErrorLevel.ERROR:
                this.error++;
                break;
              case resp.ImportErrorLevel.FATAL:
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

  refreshLogs() {
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  selectPage(page: string) {
    this.page = parseInt(page, this.pageSize) || 1;
  }

  formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

  refreshFilters():resp.ImportErrorLevel[] {
    const filteredStatus = [];
    if (this.filterForm.get('fine')?.value) {
      filteredStatus.push(resp.ImportErrorLevel.FINE); // TO-DO enhance with valid enum values
    } else 
    if (this.filterForm.get('warning')?.value) {
      filteredStatus.push(resp.ImportErrorLevel.WARNING);
    }
    if (this.filterForm.get('problem')?.value) {
      filteredStatus.push(resp.ImportErrorLevel.PROBLEM); 
    }
    if (this.filterForm.get('error')?.value) {
      filteredStatus.push(resp.ImportErrorLevel.ERROR);
    }
    if (this.filterForm.get('fatal')?.value) {
      filteredStatus.push(resp.ImportErrorLevel.FATAL);
    }
    return filteredStatus;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }

}