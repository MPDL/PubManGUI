import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/shared/services/message.service';

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
export class ActionsComponent {

  public isProcessing: boolean = false;

  constructor(
    private bs: BatchService, 
    private message: MessageService,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.bs.getBatchProcessUserLock().subscribe({
      next: () => this.isProcessing = true,
      error: () => this.isProcessing = false
    })

    if (this.isProcessing) {
      this.message.error(`Please wait, a process is runnig!\n`);
      this.message.dialog.afterAllClosed.subscribe(result => {
        this.router.navigate(['batch/datasets'])
      })
    };

    if (!this.areItemsSelected()) {
      this.message.error(`Please, select items to be processed!\n`);
      this.message.dialog.afterAllClosed.subscribe(result => {
        this.router.navigate(['list'])
      })
    }
  }

  areItemsSelected(): boolean {
    return this.bs.items && this.bs.items.length > 0;
  }
}
