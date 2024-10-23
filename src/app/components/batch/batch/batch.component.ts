import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { BatchService } from '../services/batch.service';

@Component({
  selector: 'pure-batch',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BatchNavComponent
  ],
  templateUrl: './batch.component.html',
})
export default class BatchComponent implements OnInit {

  constructor(
    public aaSvc: AaService,
    private batchSvc: BatchService,
    private msgSvc: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.aaSvc.principal.getValue().loggedIn) {
      this.msgSvc.warning(`Please, log in!\n`);
      this.msgSvc.dialog.afterAllClosed.subscribe(result => {
        this.router.navigate(['/'])
      }) 
    }

    if (this.batchSvc.areItemsSelected()) {
      this.router.navigate(['/batch/datasets'])
    } else {
      this.router.navigate(['/batch/logs'])
    }

  }
}  
