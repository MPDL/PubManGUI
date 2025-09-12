import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, HostListener, Inject, inject, LOCALE_ID, OnInit, viewChild } from '@angular/core'
import { Router, RouterModule } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportErrorLevel, ImportLogDbVO, ImportStatus } from 'src/app/model/inge';
import { MessageService } from 'src/app/services/message.service';

import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from "src/app/components/shared/paginator/paginator.component";
import { ImportLogComponent } from "./import-log/import-log.component";
import { TranslatePipe } from "@ngx-translate/core";

import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'pure-import-logs-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginatorComponent,
    ImportLogComponent,
    TranslatePipe,
    MatBadgeModule
  ],
  templateUrl: './import-logs-list.component.html'
})
export default class ImportLogsListComponent implements OnInit {

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);

  viewportScroller = inject(ViewportScroller);
  scrollingRef = viewChild<HTMLElement>('scrolling');

  currentPage = this.importsSvc.lastPageNumFrom().myImports;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogDbVO[] = [];
  logs: ImportLogDbVO[] = [];
  runningImports: Map<number, number> = new Map();

  importStatus: typeof ImportStatus = ImportStatus;
  importErrorLevel: typeof ImportErrorLevel = ImportErrorLevel;

  isScrolled = false;

  updateDelay = 1;

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.importsSvc.getImportLogs()
      .subscribe(importsResponse => {
        this.logs = importsResponse.sort((b, a) => a.id - b.id);
        this.collectionSize = this.logs.length;
        this.refreshLogs();

        this.logs.forEach((importLog, idx) => {
          if (!this.isFinished(importLog.status)) {
            this.runningImports.set(importLog.id, idx);
          }
        });
        this.updateForRunningImports();
      });
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
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + (this.pageSize),
    );
    this.importsSvc.lastPageNumFrom().myImports = this.currentPage;
  }

  getPreferredPageSize(): number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize || 25;
  }

  isFinished(status: ImportStatus): boolean {
    if (status === ImportStatus.FINISHED) {
      return true;
    }
    return false;
  }

  updateForRunningImports() {
    this.runningImports.forEach((idx, logId) => {
      this.importsSvc.getImportLog(logId)
        .subscribe(importLog => {
          this.logs[idx].status = importLog.status;
          this.logs[idx].percentage = importLog.percentage;
          this.logs[idx].anzImportedItems = importLog.anzImportedItems;
          if (this.isFinished(importLog.status)) {
            this.runningImports.delete(logId);
            this.updateDelay = 1;
          }
        })
    })
    if (this.runningImports.size > 0) {
      setTimeout(() => {
        this.updateForRunningImports();
        this.refreshLogs();
      }, 1000 * (this.updateDelay < 60 ? Math.ceil(this.updateDelay++ / 10) : 60));
    }
  }

  deleteImportLog(log: any): void {
    this.importsSvc.deleteImportLog(log.id).subscribe(importsResponse => {
      this.importsSvc.checkImports();
      // console.log(importsResponse);
    })

    let element = document.getElementById(log.id) as HTMLElement;
    element.remove();

    this.logs = this.logs.filter(item => item.id != log.id);
    this.collectionSize = this.logs.length;
    this.refreshLogs();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 20 ? true : false;
  }
}
