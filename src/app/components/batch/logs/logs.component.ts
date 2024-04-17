import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { MessageService } from 'src/app/shared/services/message.service';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { LogProcessListComponent } from './process/list/log-process-list.component';
import { LogItemListComponent } from './item/list/log-item-list.component';

import { BatchService } from '../services/batch.service';

@Component({
  selector: 'pure-batch-logs',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
    LogProcessListComponent,
    LogItemListComponent,
  ],
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit { 
  
  batchProcessLogHeaderId = 0;

  constructor(private bs: BatchService, private message: MessageService) { }

  ngOnInit(): void {    

  }
}