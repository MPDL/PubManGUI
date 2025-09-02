import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, HostListener, inject, OnInit, signal } from '@angular/core';
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
  private document = inject(DOCUMENT);

  mobile: boolean | null = null;
  mobile_options: HTMLElement | null = null;

  display: boolean = false;

  ngOnInit(): void {
    this.batchSvc.items;

    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }

  // TO-DO ???
  warning(option: string) {
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
    }

    this.collapse();
  }

  collapse() {
    if (this.mobile) {
      if (!this.mobile_options) this.mobile_options = this.document.getElementById('side_nav_mobile_options');
      if (this.mobile_options?.classList.contains('show')) this.mobile_options!.classList.remove('show');
    }
  }

  showMore(): boolean {
    this.display = !this.display;
    return this.display;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }

}
