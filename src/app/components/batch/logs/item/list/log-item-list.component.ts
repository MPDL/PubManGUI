import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type * as resp from 'src/app/components/batch/interfaces/actions-responses';

import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { ItemVersionVO, BatchProcessLogDetailState } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/batch/pipes/stateFilter.pipe';
import { SeparateFilterPipe } from 'src/app/components/batch/pipes/separateFilter.pipe';
import { ItemsService} from "src/app/services/pubman-rest-client/items.service";



const FILTER_PAG_REGEX = /[^0-9]/g;

type detail = {
 'item': resp.getBatchProcessLogDetailsResponse,
 'title': string
}

@Component({
  selector: 'pure-batch-log-item-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbPaginationModule,
    NgbTooltip,
    StateFilterPipe,
    SeparateFilterPipe
  ],
  templateUrl: './log-item-list.component.html',
})

export default class LogItemListComponent implements OnInit, DoCheck {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  inPage: detail[] = [];

  detailLogs: detail[] = [];
  items: ItemVersionVO[] = [];

  method: string | undefined;
  started: Date | undefined;
  failed: number = 0;

  batchProcessLogDetailStateTranslations = {};
  batchProcessMessageTranslations = {};

  public filterForm: FormGroup = this.fb.group({
    success: [true, Validators.requiredTrue],
    fail: [true, Validators.requiredTrue],
  });

  constructor(
    private batchSvc: BatchService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private itemSvc: ItemsService, 
    private msgSvc: MessageService, 
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    if (this.locale === 'de') {
      import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
      })
    } else {
      import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
      })
    }

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.batchSvc.getBatchProcessLogDetails(id)),
      )
      .subscribe(LOGS => {
        if (LOGS.length === 0) return this.router.navigate(['/batch/logs']);

        LOGS.sort((a,b) => b.startDate.valueOf() - a.startDate.valueOf())
          .forEach(element => this.itemSvc.retrieve(element.itemObjectId, this.batchSvc.token)
            .subscribe( actionResponse =>
                {
                  this.detailLogs.push({item: element, title: actionResponse.metadata?.title});
                  this.collectionSize++;
                  if(element.state === BatchProcessLogDetailState.ERROR) this.failed++;
                  return
                })
            );

        return;
      })

    this.method = history.state.method;
    this.started = history.state.started;

  }

  ngDoCheck(): void {
    this.refreshLogs();
  }

  refreshLogs() {
    this.inPage = this.detailLogs.map((log, i) => ({ id: i + 1, ...log })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  selectPage(page: string) {
		this.page = parseInt(page, this.pageSize) || 1;
	}

	formatInput(input: HTMLInputElement) {
		input.value = input.value.replace(FILTER_PAG_REGEX, '');
	}

  goBack(): void {
    this.router.navigateByUrl('/batch/logs');
  }

  getProcessLogDetailStateTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessLogDetailStateTranslations;
    return this.batchProcessLogDetailStateTranslations[key];
  }

  getProcessMessageTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessMessageTranslations;
    return this.batchProcessMessageTranslations[key];
  }

  fillWithAll() {
    const toFill: string[] = [];
    this.detailLogs.forEach(element => { if (element.item.itemObjectId) toFill.push(element.item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${ toFill.length } items to batch!\n`;
    this.msgSvc.info(msg);
  }

  fillWithFailed() {
    const toFill: string[] = [];
    this.detailLogs.forEach(element => { if (element.item.itemObjectId && element.item.state === BatchProcessLogDetailState.ERROR) toFill.push(element.item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${ toFill.length } items to batch!\n`;
    this.msgSvc.info(msg);
  }

  refreshFilters():BatchProcessLogDetailState[] {
    const filteredStatus = [];
    if (this.filterForm.get('success')?.value) {
      filteredStatus.push(BatchProcessLogDetailState.SUCCESS); // TO-DO enhance with valid enum values
    }
    if (this.filterForm.get('fail')?.value) {
      filteredStatus.push(BatchProcessLogDetailState.ERROR);
    }
    return filteredStatus;
  }

}
