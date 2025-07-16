import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { FormsModule } from '@angular/forms';

import { MatBadgeModule } from '@angular/material/badge';
import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";
import { BatchActionLogComponent } from "./batch-action-log/batch-action-log.component";

import { TranslatePipe } from "@ngx-translate/core";

type detail = {
  'item': resp.BatchProcessLogDetailDbVO,
  'title': string
}

@Component({
  selector: 'pure-batch-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatBadgeModule,
    PaginatorComponent,
    BatchActionLogComponent,
    TranslatePipe
],
  templateUrl: './batch-log-list.component.html'
})
export default class BatchLogsListComponent implements OnInit {

  batchSvc = inject(BatchService);

  currentPage = this.batchSvc.lastPageNumFrom().logs;
  pageSize = 25;
  collectionSize = 0;
  inPage: resp.BatchProcessLogHeaderDbVO[] = [];
  processLogs: resp.BatchProcessLogHeaderDbVO[] = [];

  state = resp.BatchProcessLogHeaderState;
  detailLogs: detail[] = [];

  isScrolled = false;

  ngOnInit(): void {
    this.batchSvc.getAllBatchProcessLogHeaders()
      .subscribe(batchResponse => {
        this.processLogs = batchResponse.sort((b, a) => a.batchLogHeaderId - b.batchLogHeaderId);
        this.collectionSize = this.processLogs.length;
        this.refreshLogs();
        return;
      }
    );

  }

  refreshLogs() {
    this.currentPage = Math.ceil((this.currentPage * this.pageSize) / this.getPreferredPageSize());
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
    } else return this.pageSize || 25;
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
