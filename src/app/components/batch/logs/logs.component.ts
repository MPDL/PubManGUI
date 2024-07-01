import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AaService } from 'src/app/services/aa.service';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';

import { LogProcessListComponent } from './process/list/log-process-list.component';
import LogItemListComponent from './item/list/log-item-list.component';

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
export default class LogsComponent implements OnInit { 
  
  batchProcessLogHeaderId = 0;

  constructor(
    private batchSvc: BatchService, 
    public aaSvc: AaService) { }

  ngOnInit(): void {    

  }

}