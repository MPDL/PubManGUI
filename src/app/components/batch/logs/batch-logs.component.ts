import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { ItemsService } from "src/app/services/pubman-rest-client/items.service";

import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


type detail = {
  'item': resp.BatchProcessLogDetailDbVO,
  'title': string
}

@Component({
  selector: 'pure-batch-logs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatBadgeModule,
    PaginatorComponent
  ],
  templateUrl: './batch-logs.component.html'
})
export default class LogProcessListComponent implements OnInit {

  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.BatchProcessLogHeaderDbVO[] = [];
  processLogs: resp.BatchProcessLogHeaderDbVO[] = [];

  state = resp.BatchProcessLogHeaderState;
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
      .subscribe(batchResponse => {
        this.processLogs = batchResponse.sort((b, a) => a.batchLogHeaderId - b.batchLogHeaderId);
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
    this.inPage = this.processLogs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + (this.pageSize),
    );
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
