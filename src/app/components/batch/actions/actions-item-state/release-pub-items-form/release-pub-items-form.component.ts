import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ReleasePubItemsParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-release-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './release-pub-items-form.component.html',
})
export class ReleasePubItemsFormComponent { 
  constructor(
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  get releasePubItemsParams(): ReleasePubItemsParams {
    const actionParams: ReleasePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.releasePubItems(this.releasePubItemsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
    });
  }
}
