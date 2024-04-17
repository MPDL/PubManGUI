import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { throwError } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { BatchService } from '../services/batch.service';

import { ItemListComponent } from 'src/app/components/item-list/item-list.component';

@Component({
  selector: 'pure-batch-datasets',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
    ItemListComponent
  ],
  templateUrl: './datasets.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetsComponent { 
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

  }
}
