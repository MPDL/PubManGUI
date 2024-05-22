import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from '../../../interfaces/actions-responses';

import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'pure-batch-log-process-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    NgbTypeaheadModule, 
    NgbPaginationModule
  ],
  templateUrl: './log-process-list.component.html'
})
export class LogProcessListComponent implements OnInit { 

  page = 1;
	pageSize = 10;
	collectionSize = 0;
  inPage: resp.BatchProcessLogHeaderDbVO[] = [];
  processLogs: resp.BatchProcessLogHeaderDbVO[] = [];

  constructor(private bs: BatchService) {}

  ngOnInit(): void {
    this.bs.getAllBatchProcessLogHeaders().subscribe( actionResponse => 
      { console.log(actionResponse);
        this.processLogs = actionResponse.sort((b,a) => a.batchLogHeaderId - b.batchLogHeaderId);
        console.log(actionResponse);
        this.collectionSize = this.processLogs.length;
        this.refreshLogs();
        return;
      });
  }

  refreshLogs() {
		this.inPage = this.processLogs.map((log, i) => ({ id: i + 1, ...log })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + (this.pageSize),
		);
	}

  selectPage(page: string) {
		this.page = parseInt(page, this.pageSize) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

}