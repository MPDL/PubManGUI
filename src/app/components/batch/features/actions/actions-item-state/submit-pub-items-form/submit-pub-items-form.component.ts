import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { SubmitPubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-submit-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './submit-pub-items-form.component.html',
})
export class SubmitPubItemsFormComponent {
  batchSvc = inject(BatchService);
  router = inject(Router);

  get submitPubItemsParams(): SubmitPubItemsParams {
    const actionParams: SubmitPubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    this.batchSvc.submitPubItems(this.submitPubItemsParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
