import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { SubmitPubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

@Component({
  selector: 'pure-submit-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './submit-pub-items-form.component.html',
})
export class SubmitPubItemsFormComponent { 

  constructor(
    private router: Router,
    private batchSvc: BatchService,
    //private msgSvc: MessageService
  ) { }

  get submitPubItemsParams(): SubmitPubItemsParams {
    const actionParams: SubmitPubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.submitPubItems(this.submitPubItemsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
