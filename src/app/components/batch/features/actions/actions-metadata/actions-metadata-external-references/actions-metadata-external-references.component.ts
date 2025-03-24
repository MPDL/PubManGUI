import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChangeExternalReferenceContentCategoryFormComponent } from './change-external-reference-content-category-form/change-external-reference-content-category-form.component'

@Component({
  selector: 'pure-batch-actions-metadata-external-references',
  standalone: true,
  imports: [
    CommonModule,
    ChangeExternalReferenceContentCategoryFormComponent
  ],
  templateUrl: './actions-metadata-external-references.component.html',
})
export class ActionsMetadataExternalReferencesComponent { }
