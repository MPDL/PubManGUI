import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { RevisePubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-revise-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './revise-pub-items-form.component.html',
})
export class RevisePubItemsFormComponent {
  batchSvc = inject(BatchService);
  router = inject(Router);

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
      this.router.navigate(['/batch/logs']);
    });
  }
}
