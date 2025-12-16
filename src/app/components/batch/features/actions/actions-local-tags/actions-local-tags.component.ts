
import { Component } from '@angular/core';

import { AddLocalTagsFormComponent } from './add-local-tags-form/add-local-tags-form.component';
import { ChangeLocalTagsFormComponent } from './change-local-tags-form/change-local-tags-form.component'

@Component({
  selector: 'pure-batch-actions-local-tags',
  standalone: true,
  imports: [
    AddLocalTagsFormComponent,
    ChangeLocalTagsFormComponent
],
  templateUrl: './actions-local-tags.component.html',
})
export class ActionsLocalTagsComponent { }
