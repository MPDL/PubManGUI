import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ChangeSourceGenreFormComponent } from './change-source-genre-form/change-source-genre-form.component';
import { ReplaceSourceEditionFormComponent } from './replace-source-edition-form/replace-source-edition-form.component';
import { AddSourceIdentifierFormComponent } from './add-source-identifier-form/add-source-identifier-form.component';
import { ChangeSourceIdentifierFormComponent } from './change-source-identifier-form/change-source-identifier-form.component';

@Component({
  selector: 'pure-batch-actions-metadata-source',
  standalone: true,
  imports: [
    CommonModule,
    ChangeSourceGenreFormComponent,
    ReplaceSourceEditionFormComponent,
    AddSourceIdentifierFormComponent,
    ChangeSourceIdentifierFormComponent
  ],
  templateUrl: './actions-metadata-source.component.html',
})
export class ActionsMetadataSourceComponent { }
