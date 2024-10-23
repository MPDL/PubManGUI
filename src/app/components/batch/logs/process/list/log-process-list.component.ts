import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type * as resp from 'src/app/components/batch/interfaces/actions-responses';

import { ItemsService } from "src/app/services/pubman-rest-client/items.service";
import { BatchProcessLogHeaderState } from 'src/app/model/inge';

import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { SeparateFilterPipe } from 'src/app/components/batch/pipes/separateFilter.pipe';

import { MatBadgeModule } from '@angular/material/badge';

const FILTER_PAG_REGEX = /[^0-9]/g;

type detail = {
  'item': resp.getBatchProcessLogDetailsResponse,
  'title': string
}

@Component({
  selector: 'pure-batch-log-process-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbPaginationModule,
    SeparateFilterPipe,
    MatBadgeModule
  ],
  templateUrl: './log-process-list.component.html'
})
export class LogProcessListComponent implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.BatchProcessLogHeaderDbVO[] = [];
  processLogs: resp.BatchProcessLogHeaderDbVO[] = [];

  state = BatchProcessLogHeaderState;
  batchProcessLogHeaderStateTranslations = {};
  batchProcessMethodTranslations = {};
  detailLogs: detail[] = [];

  isScrolled = false;

  constructor(
    public batchSvc: BatchService,
    private itemSvc: ItemsService,
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.batchSvc.getAllBatchProcessLogHeaders()
      .subscribe(actionResponse => {
        this.processLogs = actionResponse.sort((b, a) => a.batchLogHeaderId - b.batchLogHeaderId);
        this.collectionSize = this.processLogs.length;
        this.refreshLogs();
        return;
      }
    );

    this.loadTranslations(this.locale);
   
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogHeaderStateTranslations = msgs.BatchProcessLogHeaderState;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogHeaderStateTranslations = msgs.BatchProcessLogHeaderState;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    }
  } 

  refreshLogs() {
    this.inPage = this.processLogs.map((log, i) => ({ id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + (this.pageSize),
    );
  }

  selectPage(page: string) {
    this.page = parseInt(page, this.pageSize) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

  getProcessLogHeaderStateTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessLogHeaderStateTranslations;
    return this.batchProcessLogHeaderStateTranslations[key];
  }

  getProcessMethodTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}