import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck, Inject, LOCALE_ID, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/batch-responses';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

import { ItemVersionVO } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/batch/pipes/stateFilter.pipe';
import { ItemsService} from "src/app/services/pubman-rest-client/items.service";

import { SanitizeHtmlPipe } from "src/app//shared/services/pipes/sanitize-html.pipe";
import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";


type detail = {
 'item': resp.BatchProcessLogDetailDbVO,
 'title': string
}

@Component({
  selector: 'pure-batch-log-item-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbTooltip,
    StateFilterPipe,
    RouterLink,
    SanitizeHtmlPipe,
    PaginatorComponent
  ],
  templateUrl: './items.component.html',
})

export default class LogItemListComponent implements OnInit, DoCheck {
  page = 1;
  pageSize = 25;
  collectionSize = 0;
  inPage: detail[] = [];

  detailLogs: detail[] = [];
  items: ItemVersionVO[] = [];

  method: string | undefined;
  started: Date | undefined;
  failed: number = 0;

  batchProcessLogDetailStateTranslations = {};
  batchProcessMessageTranslations = {};
  batchProcessMethodTranslations = {};

  public filterForm: FormGroup = this.fb.group({
    success: [true, Validators.requiredTrue],
    fail: [true, Validators.requiredTrue],
  });

  isScrolled = false;

  constructor(
    private batchSvc: BatchService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private itemSvc: ItemsService,
    private msgSvc: MessageService,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    this.loadTranslations(this.locale);

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
                  if(element.state === resp.BatchProcessLogDetailState.ERROR) this.failed++;
                  return
                })
            );

        return;
      })

    this.method = history.state.method;
    this.started = history.state.started;
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    } else {
      import('src/assets/i18n/messages.json').then((msgs) => {
        this.batchProcessLogDetailStateTranslations = msgs.BatchProcessLogDetailState;
        this.batchProcessMessageTranslations = msgs.BatchProcessMessages;
        this.batchProcessMethodTranslations = msgs.BatchProcessMethod;
      })
    }
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

  getProcessLogDetailStateTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessLogDetailStateTranslations;
    return this.batchProcessLogDetailStateTranslations[key];
  }

  getProcessMessageTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessMessageTranslations;
    return this.batchProcessMessageTranslations[key];
  }

  getProcessMethodTranslation(txt: string):string {
    let key = txt as keyof typeof this.batchProcessMethodTranslations;
    return this.batchProcessMethodTranslations[key];
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
    this.detailLogs.forEach(element => { if (element.item.itemObjectId && element.item.state === resp.BatchProcessLogDetailState.ERROR) toFill.push(element.item.itemObjectId) });
    this.batchSvc.items = toFill;
    const msg = `${ toFill.length } items to batch!\n`;
    this.msgSvc.info(msg);
  }

  refreshFilters():resp.BatchProcessLogDetailState[] {
    const filteredStatus = [];
    if (this.filterForm.get('success')?.value) {
      filteredStatus.push(resp.BatchProcessLogDetailState.SUCCESS); // TO-DO enhance with valid enum values
    }
    if (this.filterForm.get('fail')?.value) {
      filteredStatus.push(resp.BatchProcessLogDetailState.ERROR);
    }
    return filteredStatus;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
