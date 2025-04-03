import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { ItemVersionVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ItemsService } from "src/app/services/pubman-rest-client/items.service";

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";
import { BatchActionDatasetLogComponent } from "./batch-action-dataset-log/batch-action-dataset-log.component";


@Component({
  selector: 'pure-batch-action-details-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltip,
    PaginatorComponent,
    BatchActionDatasetLogComponent
  ],
  templateUrl: './batch-action-details-list.component.html',
})

export default class BatchActionDetailsListComponent implements OnInit {

  batchSvc = inject(BatchService);
  itemSvc = inject(ItemsService);
  msgSvc = inject(MessageService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);

  currentPage = this.batchSvc.lastPageNumFrom().details;
  pageSize = 25;

  inPage: resp.BatchProcessLogDetailDbVO[] = [];

  unfilteredSize = 0;
  filteredSize = 0;

  unfilteredLogs: resp.BatchProcessLogDetailDbVO[] = [];
  filteredLogs: resp.BatchProcessLogDetailDbVO[] = [];

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
          let itemsCount = batchResponse.length;
          if (itemsCount === 0) this.router.navigate(['/batch/logs']);

          batchResponse.sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf())
            .forEach((element, index) => {
              if (element.state != resp.BatchProcessLogDetailState.SUCCESS) this.failed++;
            })
          this.filteredLogs = this.unfilteredLogs = batchResponse;
          this.filteredSize = this.unfilteredSize = this.unfilteredLogs.length;

          this.refreshLogs();

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
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      import('src/assets/i18n/messages.json').then((msgs) => {
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

  getProcessMethodTranslation(txt: string): string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
  }

  fillWithAll() {
    const toFill: string[] = [];
    this.unfilteredLogs.forEach(item => { if (item.itemObjectId) toFill.push(item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${toFill.length} ` + $localize`:@@batch.datasets.filled:items to batch!` + '\n';
    this.msgSvc.info(msg);
  }

  fillWithFailed() {
    const toFill: string[] = [];
    this.unfilteredLogs.forEach(item => { if (item.itemObjectId && item.state === resp.BatchProcessLogDetailState.ERROR) toFill.push(item.itemObjectId) });
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
      this.activeFilters.push(resp.BatchProcessLogDetailState.INITIALIZED);
      this.activeFilters.push(resp.BatchProcessLogDetailState.RUNNING);
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
    this.filteredLogs = this.unfilteredLogs.filter(item => this.activeFilters.includes(item.state));
    this.filteredSize = this.filteredLogs.length;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
