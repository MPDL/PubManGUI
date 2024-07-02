import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { RevisePubItemsParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-revise-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './revise-pub-items-form.component.html',
})
export class RevisePubItemsFormComponent { 
  constructor(
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  get revisePubItemsParams(): RevisePubItemsParams {
    const actionParams: RevisePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.revisePubItems(this.revisePubItemsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
    });
  }
}
