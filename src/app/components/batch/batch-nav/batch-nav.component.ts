import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/services/message.service';
import { BatchService } from '../services/batch.service';

import { MatBadgeModule } from '@angular/material/badge';
import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'pure-batch-nav',
  templateUrl: './batch-nav.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    RouterModule,
    MatBadgeModule,
    TranslatePipe]
})
export class BatchNavComponent implements OnInit {

  router = inject(Router);
  msgSvc = inject(MessageService);
  batchSvc = inject(BatchService);
  aaSvc = inject(AaService);
  translateSvc = inject(TranslateService);

  isMoreShown: boolean = false;

  ngOnInit(): void {
    this.batchSvc.items;
    this.batchSvc.checkLogs();
  }

  whenReady(option: string) {
    switch (option) {
      case '/batch/datasets':
        if (!this.batchSvc.areItemsSelected()) {
          this.msgSvc.warning(this.translateSvc.instant(_('batch.datasets.empty')) + '!\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        }
        break;
      case '/batch/actions':
        if (!this.batchSvc.areItemsSelected()) {
          this.msgSvc.warning(this.translateSvc.instant(_('batch.datasets.empty')) + '!\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        } else if (this.batchSvc.isProcessRunning()) {
          this.msgSvc.warning(this.translateSvc.instant(_('batch.actions.running')) + '!\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        }
        break;
      case '/batch/logs':
        if (!this.batchSvc.hasLogs()) {
          this.msgSvc.warning(this.translateSvc.instant(_('batch.logs.details.empty')) + '\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        }
        break;
      }
  }

  showMore(): boolean {
    this.isMoreShown = !this.isMoreShown;
    return this.isMoreShown;
  }

  //style = window.getComputedStyle(document.querySelector('#batch-options')!);

}
