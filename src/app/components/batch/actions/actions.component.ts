import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActionsItemStateComponent } from './actions-item-state/actions-item-state.component';
import { ActionsContextComponent } from './actions-context/actions-context.component';
import { ActionsLocalTagsComponent } from './actions-local-tags/actions-local-tags.component';
import { ActionsGenreComponent } from './actions-genre/actions-genre.component';
import { ActionsMetadataComponent } from './actions-metadata/actions-metadata.component';

@Component({
  selector: 'pure-actions',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
    ReactiveFormsModule,
    ActionsItemStateComponent,
    ActionsContextComponent,
    ActionsLocalTagsComponent,
    ActionsGenreComponent,
    ActionsMetadataComponent
  ],
  templateUrl: './actions.component.html'
})
export class ActionsComponent { }
