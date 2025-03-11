import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { DeletePubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

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
    private router: Router,
    private batchSvc: BatchService) {}

  get deletePubItemsParams(): DeletePubItemsParams {
    const actionParams: DeletePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.deletePubItems(this.deletePubItemsParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
