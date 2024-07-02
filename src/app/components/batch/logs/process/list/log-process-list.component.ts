import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from '../../../interfaces/actions-responses';

import { ItemsService} from "src/app/services/pubman-rest-client/items.service";
import { BatchProcessLogHeaderState } from 'src/app/model/inge';

import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule} from "@ng-bootstrap/ng-bootstrap";

const FILTER_PAG_REGEX = /[^0-9]/g;

type detail = {
  'item': resp.getBatchProcessLogDetailsResponse,
  'title': string
 }

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
  
  state = BatchProcessLogHeaderState;
  detailLogs: detail[] = [];  

  constructor(
    public batchSvc: BatchService,
    private itemSvc: ItemsService ) {}

  ngOnInit(): void {
    this.batchSvc.getAllBatchProcessLogHeaders().subscribe( actionResponse => { 
        this.processLogs = actionResponse.sort((b,a) => a.batchLogHeaderId - b.batchLogHeaderId);
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

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100/numberOfItems);
  };

}