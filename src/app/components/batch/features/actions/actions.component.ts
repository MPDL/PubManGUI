import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ActionsItemStateComponent } from './actions-item-state/actions-item-state.component';
import { ActionsContextComponent } from './actions-context/change-context.component';
import { ActionsLocalTagsComponent } from './actions-local-tags/actions-local-tags.component';
import { ActionsGenreComponent } from './actions-genre/change-genre.component';
import { ActionsMetadataComponent } from './actions-metadata/actions-metadata.component';

import { BatchService } from '../../services/batch.service';
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-batch-actions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionsItemStateComponent,
    ActionsContextComponent,
    ActionsLocalTagsComponent,
    ActionsGenreComponent,
    ActionsMetadataComponent,
    TranslatePipe
  ],
  templateUrl: './actions.component.html'
})
export default class ActionsComponent implements OnInit {

  public isReady: boolean = false;

  constructor(
    public batchSvc: BatchService,
  ) { }

  ngOnInit() {
    this.batchSvc.items;
    this.isReady = (this.batchSvc.areItemsSelected() && !this.batchSvc.isProcessRunning()) ? true : false;
  }

}
