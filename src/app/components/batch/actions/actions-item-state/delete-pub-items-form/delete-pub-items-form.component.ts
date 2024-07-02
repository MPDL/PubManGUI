import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { DeletePubItemsParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-delete-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './delete-pub-items-form.component.html'
})
export class DeletePubItemsFormComponent { 

  constructor(
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  get deletePubItemsParams(): DeletePubItemsParams {
    const actionParams: DeletePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.deletePubItems(this.deletePubItemsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
    });
  }
}
