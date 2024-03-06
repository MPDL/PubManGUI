import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { throwError } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { ReactiveFormsModule } from '@angular/forms';
import { ActionsItemStateComponent } from './actions-item-state/actions-item-state.component';
import { ActionsContextComponent } from './actions-context/actions-context.component';
import { ActionsLocalTagsComponent } from './actions-local-tags/actions-local-tags.component';
import { ActionsGenreComponent } from './actions-genre/actions-genre.component';
import { ActionsMetadataComponent } from './actions-metadata/actions-metadata.component';

import { BatchService } from '../services/batch.service';

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
export class ActionsComponent {

  private isProcessing: boolean = false;

  constructor(private bs: BatchService, private message: MessageService) { }

  ngAfterViewInit() {
    this.bs.getBatchProcessUserLock().subscribe({
      next: () => this.isProcessing = true,
      error: () => this.isProcessing = false
    })

    if (this.isProcessing) {
      const msg = `Please wait, a process is runnig!\n`;
      this.message.error(msg);
      throwError(() => msg);
    };

    if (!this.bs.items) {
      const msg = `Please, select items to be processed!\n`;
      this.message.error(msg);
      throwError(() => msg);
    }
  }
}
