import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { ItemVersionVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { StateFilterPipe } from 'src/app/components/batch/pipes/stateFilter.pipe';
import { ItemsService } from "src/app/services/pubman-rest-client/items.service";

import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";
import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


type detail = {
  'item': resp.BatchProcessLogDetailDbVO,
  'title': string
}

@Component({
  selector: 'pure-batch-log-item-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltip,
    //StateFilterPipe,
    RouterLink,
    SanitizeHtmlPipe,
    PaginatorComponent
  ],
  templateUrl: './items.component.html',
})

export default class LogItemListComponent implements OnInit {

  batchSvc = inject(BatchService);
  itemSvc = inject(ItemsService);
  msgSvc = inject(MessageService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  currentPage = this.batchSvc.lastPageNumFrom().details;
  pageSize = 25;

  inPage: detail[] = [];

  unfilteredSize = 0;
  filteredSize = 0;

  unfilteredLogs: detail[] = [];
  filteredLogs: detail[] = [];

  items: ItemVersionVO[] = [];

  batchLogHeader!: resp.BatchProcessLogHeaderDbVO;
  failed: number = 0;

  public filterForm: FormGroup = this.fb.group({
    success: [true, Validators.requiredTrue],
    fail: [true, Validators.requiredTrue],
  });

  activeFilters: resp.BatchProcessLogDetailState[] = [
    resp.BatchProcessLogDetailState.SUCCESS,
    resp.BatchProcessLogDetailState.ERROR
  ];

  batchProcessLogDetailStateTranslations = {};
  batchProcessMessageTranslations = {};
  batchProcessMethodTranslations = {};

  isScrolled = false;

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(value => {
      this.batchLogHeader = value['log'];
    });

    if (this.batchLogHeader.batchLogHeaderId) {
      this.batchSvc.getBatchProcessLogDetails(Number(this.batchLogHeader.batchLogHeaderId))
        .subscribe(batchResponse => {
          if (batchResponse.length === 0) this.router.navigate(['/batch/logs']);

          batchResponse.sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf())
            .forEach((element, index) => {
              if (element.state === resp.BatchProcessLogDetailState.ERROR) this.failed++;
              var title = '';
              this.batchSvc.getItem(element.itemObjectId)
                .subscribe({
                  next: (value) => {
                    title = value.metadata?.title;
                  },
                  error: () => {
                    this.unfilteredLogs.push({ item: element, title: '404' });
                  },
                  complete: () => {
                    this.unfilteredLogs.push({ item: element, title: title });
                    if (index === batchResponse.length - 1) {
                      this.filteredLogs = this.unfilteredLogs;
                      this.filteredSize = this.unfilteredSize = this.unfilteredLogs.length;

                      this.refreshLogs();
                    }
                  }
                })
            })

          if (this.batchSvc.getLogFilters().length > 0) {
            if (this.activeFilters.length === this.batchSvc.getLogFilters().length
              && (this.activeFilters.every((element_1) =>
                this.batchSvc.getLogFilters().some((element_2) =>
                  Object.keys(element_1).every((key: any) => element_1[key] === element_2[key])
                )))) {
            } else {
              this.activeFilters = this.batchSvc.getLogFilters();
              this.filterForm.patchValue({
                success: this.activeFilters.includes(resp.BatchProcessLogDetailState.SUCCESS),
                fail: this.activeFilters.includes(resp.BatchProcessLogDetailState.ERROR),
              });
              this.updateFilteredLogs();
            }
          }
          //return;
        });
    }

    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    }
  }

  refreshLogs() {
    this.currentPage = Math.ceil((this.currentPage * this.pageSize) / this.getPreferredPageSize());
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.filteredLogs.map((log, i) => ({ id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + this.pageSize,
    );
    this.batchSvc.lastPageNumFrom().details = this.currentPage;
  }

  getPreferredPageSize(): number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize || 25;
  }

  getProcessLogDetailStateTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessLogDetailStateTranslations;
    return this.batchProcessLogDetailStateTranslations[key];
  }

  getProcessMessageTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMessageTranslations;
    return this.batchProcessMessageTranslations[key];
  }

  getProcessMethodTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
  }

  fillWithAll() {
    const toFill: string[] = [];
    this.unfilteredLogs.forEach(element => { if (element.item.itemObjectId) toFill.push(element.item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${toFill.length} ` + $localize`:@@batch.datasets.filled:items to batch!` + '\n';
    this.msgSvc.info(msg);
  }

  fillWithFailed() {
    const toFill: string[] = [];
    this.unfilteredLogs.forEach(element => { if (element.item.itemObjectId && element.item.state === resp.BatchProcessLogDetailState.ERROR) toFill.push(element.item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${toFill.length} ` + $localize`:@@batch.datasets.filled:items to batch!` + '\n';
    this.msgSvc.info(msg);
  }

  refreshFilters(): void {
    this.activeFilters = [];
    if (this.filterForm.get('success')?.value) {
      this.activeFilters.push(resp.BatchProcessLogDetailState.SUCCESS);
    }
    if (this.filterForm.get('fail')?.value) {
      this.activeFilters.push(resp.BatchProcessLogDetailState.ERROR);
    }
  }

  saveFilters(): void {
    this.batchSvc.setLogFilters(this.activeFilters);
  }

  onFilterChange(): void {
    this.refreshFilters();
    this.saveFilters();

    this.updateFilteredLogs();
    this.currentPage = 1;
    this.refreshLogs();
  }

  updateFilteredLogs():void {
    this.filteredLogs = this.unfilteredLogs.filter(element => this.activeFilters.includes(element.item.state));
    this.filteredSize = this.filteredLogs.length;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
