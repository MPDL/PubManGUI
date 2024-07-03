import { CommonModule } from '@angular/common';
import { OnInit, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchService } from '../services/batch.service';

interface NavOption {
  text: string;
  route: string;
  disabled: boolean;
}

@Component({
  selector: 'pure-batch-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule],
  templateUrl: './batch-nav.component.html'
})
export class BatchNavComponent implements OnInit {

  public navList = signal<NavOption[]>([
    { route: '/batch/datasets', text: 'datasets', disabled: false },
    { route: '/batch/actions', text: 'actions', disabled: false },
    { route: '/batch/logs', text: 'logs', disabled: false },
  ]);

  constructor(
    public aaSvc: AaService,
    private batchSvc: BatchService,
    private msgSvc: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.navList()[0].disabled = !this.batchSvc.areItemsSelected();
    this.navList()[1].disabled = !this.batchSvc.areItemsSelected() || this.batchSvc.isProcessRunning();
  }

  warning(option: string) {
    switch (option) {
      case 'datasets':
        if (!this.batchSvc.areItemsSelected()) {
          this.msgSvc.warning(`The batch processing is empty!\n`);
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        }
        break;
      case 'actions':
        if (!this.batchSvc.areItemsSelected()) {
          this.msgSvc.warning(`The batch processing is empty!\n`);
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        } else if (this.batchSvc.isProcessRunning()) {
          this.msgSvc.warning(`Please wait, a process is runnig!\n`);
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/batch'])
          })
        }
        break;
    }
  }

}