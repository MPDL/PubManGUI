import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service'
import { AaService } from 'src/app/services/aa.service';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ActionsItemStateComponent } from './actions-item-state/actions-item-state.component';
import { ActionsContextComponent } from './actions-context/change-context.component';
import { ActionsLocalTagsComponent } from './actions-local-tags/actions-local-tags.component';
import { ActionsGenreComponent } from './actions-genre/change-genre.component';
import { ActionsMetadataComponent } from './actions-metadata/actions-metadata.component';

import { BatchService } from '../services/batch.service';

@Component({
  selector: 'pure-batch-actions',
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
export default class ActionsComponent {

  public isProcessing: boolean = false;

  constructor(
    public batchSvc: BatchService, 
    private msgSvc: MessageService,
    private router: Router,
    public aaSvc: AaService
  ) { }

  ngAfterViewInit() {
 
  }

}
