import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
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
  batchSvc = inject(BatchService);
  msgSvc = inject(MessageService);
  router = inject(Router);

  get withdrawPubItemsParams(): WithdrawPubItemsParams {
    const actionParams: WithdrawPubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    let ref = this.msgSvc.displayConfirmation({ text: $localize`:@@batch.actions.item.state.withdraw.confirmation:Do you really want to withdraw this items?`, confirm: $localize`:@@confirm:Confirm`, cancel: $localize`:@@cancel:Cancel` });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.batchSvc.withdrawPubItems(this.withdrawPubItemsParams).subscribe(actionResponse => {
          this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
          this.router.navigate(['/batch/logs']);
        })
      }
    });
  }
 }
