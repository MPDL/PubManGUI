import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

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

  batchSvc = inject(BatchService);

  currentPage = this.batchSvc.lastPageNumFrom().logs;
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
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.processLogs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + (this.pageSize),
    );
    this.batchSvc.lastPageNumFrom().logs = this.currentPage;
  }

  getPreferredPageSize():number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize;
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
