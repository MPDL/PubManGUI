import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { WithdrawPubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

@Component({
  selector: 'pure-withdraw-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './withdraw-pub-items-form.component.html',
})
export class WithdrawPubItemsFormComponent {

  constructor(
    private router: Router,
    private batchSvc: BatchService,
    //private msgSvc: MessageService
  ) { }

  get withdrawPubItemsParams(): WithdrawPubItemsParams {
    const actionParams: WithdrawPubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.withdrawPubItems(this.withdrawPubItemsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    })
  }
 }
