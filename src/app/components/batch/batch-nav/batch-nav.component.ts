import { CommonModule } from '@angular/common';
import { OnInit, Component, signal, inject } from '@angular/core';
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

  public navList = signal<NavOption[]>([
    { route: '/batch/datasets', label: 'datasets', disabled: false },
    { route: '/batch/actions', label: 'actions', disabled: false },
    { route: '/batch/logs', label: 'logs', disabled: false },
  ]);


  ngOnInit(): void {
    this.batchSvc.items;
    this.navList()[0].disabled = !this.batchSvc.areItemsSelected();
    this.navList()[1].disabled = !this.batchSvc.areItemsSelected() || this.batchSvc.isProcessRunning();
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
  }

}