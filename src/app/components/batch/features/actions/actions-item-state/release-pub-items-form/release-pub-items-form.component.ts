import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ReleasePubItemsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from '@ngx-translate/core';

@Component({
  selector: 'pure-release-pub-items-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './release-pub-items-form.component.html',
})
export class ReleasePubItemsFormComponent {
  batchSvc = inject(BatchService);
  msgSvc = inject(MessageService);
  router = inject(Router);
  translateSvc = inject(TranslateService);

  get releasePubItemsParams(): ReleasePubItemsParams {
    const actionParams: ReleasePubItemsParams = {
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    let ref = this.msgSvc.displayConfirmation({ text: this.translateSvc.instant(_('batch.actions.item.state.release.confirmation')), confirm: this.translateSvc.instant(_('common.confirm')), cancel: this.translateSvc.instant(_('common.cancel')) });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.batchSvc.releasePubItems(this.releasePubItemsParams).subscribe(actionResponse => {
          this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
          this.router.navigate(['/batch/logs']);
        });
      }
    });
  }
}
