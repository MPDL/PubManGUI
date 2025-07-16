import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ChangeFileVisibilityFormComponent } from './change-file-visibility-form/change-file-visibility-form.component';
import {
  ChangeFileContentCategoryFormComponent
} from './change-file-content-category-form/change-file-content-category-form.component';
import { ReplaceFileAudienceFormComponent } from './replace-file-audience-form/replace-file-audience-form.component';

@Component({
  selector: 'pure-batch-actions-metadata-files',
  standalone: true,
  imports: [
    CommonModule,
    ChangeFileVisibilityFormComponent,
    ChangeFileContentCategoryFormComponent,
    ReplaceFileAudienceFormComponent
  ],
  templateUrl: './actions-metadata-files.component.html',
})
export class ActionsMetadataFilesComponent { }
