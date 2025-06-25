import { CommonModule, DOCUMENT } from '@angular/common';
import { OnInit, Component, signal, inject, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchService } from '../services/batch.service';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from '@ngx-translate/core';

interface NavOption {
  route: string;
  label: string;
  disabled: boolean;
}

@Component({
  selector: 'pure-batch-nav',
  templateUrl: './batch-nav.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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

  public navList = signal<NavOption[]>([
    { route: '/batch/datasets', label: 'datasets', disabled: false },
    { route: '/batch/actions', label: 'actions', disabled: false },
    { route: '/batch/logs', label: 'logs', disabled: false },
  ]);


  ngOnInit(): void {
    this.batchSvc.items;
    this.navList()[0].disabled = !this.batchSvc.areItemsSelected();
    this.navList()[1].disabled = !this.batchSvc.areItemsSelected() || this.batchSvc.isProcessRunning();

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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }

}