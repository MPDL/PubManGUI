import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeReviewMethodFormComponent } from './change-review-method-form/change-review-method-form.component';
import { AddKeywordsFormComponent } from './add-keywords-form/add-keywords-form.component';
import { ReplaceKeywordsComponent } from './replace-keywords/replace-keywords.component';


@Component({
  selector: 'pure-batch-actions-metadata-publication',
  standalone: true,
  imports: [
    CommonModule,
    ChangeReviewMethodFormComponent,
    AddKeywordsFormComponent,
    ReplaceKeywordsComponent,
  ],
  templateUrl: './actions-metadata-publication.component.html',
})
export class ActionsMetadataPublicationComponent { }
