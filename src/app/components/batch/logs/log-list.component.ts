import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

import { BatchNavComponent } from '../batch-nav/batch-nav.component';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from '../interfaces/actions-responses';

@Component({
  selector: 'pure-log-list',
  standalone: true,
  imports: [
    CommonModule,
    BatchNavComponent,
  ],
  templateUrl: './log-list.component.html'
})
export class LogListComponent implements AfterViewInit { 

  logList: resp.BatchProcessLogHeaderDbVO[] = [];

  constructor(private bs: BatchService) { }

  ngAfterViewInit(): void {
    this.bs.getAllBatchProcessLogHeaders().subscribe( actionResponse => 
      { 
        this.logList = actionResponse;
      });
  }



 }