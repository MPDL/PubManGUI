import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { DeletePubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from "@ngx-translate/core";

@Component({
  selector: 'pure-delete-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './delete-pub-items-form.component.html'
})
export class DeletePubItemsFormComponent {
  batchSvc = inject(BatchService);
  msgSvc = inject(MessageService);
  router = inject(Router);
  translateSvc = inject(TranslateService);

  get deletePubItemsParams(): DeletePubItemsParams {
    const actionParams: DeletePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    let ref = this.msgSvc.displayConfirmation({
      text: this.translateSvc.instant(_('batch.actions.item.state.delete.confirmation')),
      confirm: this.translateSvc.instant(_('common.confirm')),
      cancel: this.translateSvc.instant(_('common.cancel'))
    }); ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.batchSvc.deletePubItems(this.deletePubItemsParams).subscribe(actionResponse => {
          this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
          this.router.navigate(['/batch/logs']);
        });
      }
    });
  }
}
