import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DeletePubItemsFormComponent } from './delete-pub-items-form/delete-pub-items-form.component';
import { ReleasePubItemsFormComponent } from './release-pub-items-form/release-pub-items-form.component';
import { RevisePubItemsFormComponent } from './revise-pub-items-form/revise-pub-items-form.component';
import { SubmitPubItemsFormComponent } from './submit-pub-items-form/submit-pub-items-form.component';
import { WithdrawPubItemsFormComponent } from './withdraw-pub-items-form/withdraw-pub-items-form.component';

@Component({
  selector: 'pure-batch-actions-item-state',
  standalone: true,
  imports: [
    CommonModule,
    DeletePubItemsFormComponent,
    ReleasePubItemsFormComponent,
    RevisePubItemsFormComponent,
    SubmitPubItemsFormComponent,
    WithdrawPubItemsFormComponent
  ],
  templateUrl: './actions-item-state.component.html'
})
export class ActionsItemStateComponent { }
