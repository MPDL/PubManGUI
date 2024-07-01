import { CommonModule } from '@angular/common';
import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import * as resp from 'src/app/components/batch/interfaces/actions-responses';

import { NgbPaginationModule, NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";

import { BatchProcessMessages, ItemVersionVO, BatchProcessLogDetailState } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StateFilterPipe } from 'src/app/components/batch/pipes/stateFilter.pipe';
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
    NgbTypeaheadModule,
    NgbPaginationModule,
    StateFilterPipe
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

  messagesEn = new Map<BatchProcessMessages, string>([
    [BatchProcessMessages.BATCH_AUTHENTICATION_ERROR, "You need to be logged in, to change the publication."],
    [BatchProcessMessages.BATCH_AUTHORIZATION_ERROR, "You do not have the privileges to change the publication."],
    [BatchProcessMessages.BATCH_CONTEXT_NOT_FOUND, "The specified context was not found."],
    [BatchProcessMessages.BATCH_FILES_METADATA_OLD_VALUE_NOT_EQUAL, "The given initial value does not match the value in the file metadata."],
    [BatchProcessMessages.BATCH_INTERNAL_ERROR, "An internal error occurred during the batch processing."],
    [BatchProcessMessages.BATCH_ITEM_NOT_FOUND, "The publication was not found anymore."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_NOT_ALLOWED, "Unable to set new value. Possible reasons are restrictions to the context or the publication."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_NOT_EQUAL, "The given initial value does not match the value in the publication metadata."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_ORCID_NO_PERSON, "Either the selected person was not found in the data or the ORCID ID already matches."],
    [BatchProcessMessages.BATCH_METADATA_NO_CHANGE_VALUE, "No initial value was set. For a replacing function the values must differ."],
    [BatchProcessMessages.BATCH_METADATA_NO_NEW_VALUE_SET, "No value set."],
    [BatchProcessMessages.BATCH_METADATA_NO_SOURCE_FOUND, "No fitting source found."],
    [BatchProcessMessages.BATCH_STATE_WRONG, "The publication cannot be changed due to the current state of the publication or its context."],
    [BatchProcessMessages.BATCH_VALIDATION_GLOBAL, "Validation error."],
    [BatchProcessMessages.BATCH_VALIDATION_INVALID_ORCID, "The ORCID ID from $2 is not specified in the correct format:<br/>\r\n-> $1<br/>\r\nPlease change it in CONE."],
    [BatchProcessMessages.BATCH_VALIDATION_IP_RANGE_NOT_PROVIDED, "An attached file is missing the IP range."],
    [BatchProcessMessages.BATCH_VALIDATION_NO_SOURCE, "No fitting source found."],
  ]);

  messagesDe = new Map<BatchProcessMessages, string>([
    [BatchProcessMessages.BATCH_AUTHENTICATION_ERROR, "Sie m\u00FCssen eingeloggt sein, um die Publikation zu ver\u00E4ndern."],
    [BatchProcessMessages.BATCH_AUTHORIZATION_ERROR, "Sie haben keine Rechte, diese Publikation zu ver\u00E4ndern."],
    [BatchProcessMessages.BATCH_CONTEXT_NOT_FOUND, "Der angegebene Kontext wurde nicht gefunden."],
    [BatchProcessMessages.BATCH_FILES_METADATA_OLD_VALUE_NOT_EQUAL, "Der angegebene Initialwert und der aktuelle Wert der Datei stimmen nicht \u00FCberein."],
    [BatchProcessMessages.BATCH_INTERNAL_ERROR, "Es ist ein interner Fehler w\u00E4hrend der Batchverarbeitung aufgetreten."],
    [BatchProcessMessages.BATCH_ITEM_NOT_FOUND, "Die Publikation wurde nicht mehr gefunden."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_NOT_ALLOWED, "Der neue Wert kann nicht gesetzt werden. M\u00F6gliche Gr\u00FCnde k\u00F6nnen die Beschr\u00E4nkungen des Kontexts oder der Publikation sein."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_NOT_EQUAL, "Der angegebene Initialwert und der aktuelle Wert der Publikation stimmen nicht \u00FCberein."],
    [BatchProcessMessages.BATCH_METADATA_CHANGE_VALUE_ORCID_NO_PERSON, "Entweder wurde die ausgew\u00E4hlte Person nicht in den Daten gefunden oder die ORCID ID stimmt bereits \u00FCberein."],
    [BatchProcessMessages.BATCH_METADATA_NO_CHANGE_VALUE, "Sie m\u00FCssen einen urspr\u00FCnglichen Wert angeben. F\u00FCr den Fall einer ersetzenden Funktion m\u00FCssen sich die Werte unterscheiden."],
    [BatchProcessMessages.BATCH_METADATA_NO_NEW_VALUE_SET, "Es wurde kein Wert angegeben."],
    [BatchProcessMessages.BATCH_METADATA_NO_SOURCE_FOUND, "Keine passende Quelle gefunden."],
    [BatchProcessMessages.BATCH_STATE_WRONG, "Der Publikations- oder Kontextstatus verhindern eine \u00C4nderung der Publikation."],
    [BatchProcessMessages.BATCH_VALIDATION_GLOBAL, "Validierungsfehler."],
    [BatchProcessMessages.BATCH_VALIDATION_INVALID_ORCID, "Die ORCID ID von $2 ist nicht im richtigen Format angegeben:<br/>\r\n-> $1<br/>\r\nBitte \u00E4ndern Sie diese in CONE."],
    [BatchProcessMessages.BATCH_VALIDATION_IP_RANGE_NOT_PROVIDED, "Bei einer angeh\u00E4ngten Datei fehlt der IP Range."],
    [BatchProcessMessages.BATCH_VALIDATION_NO_SOURCE, "Keine passende Quelle gefunden."],
  ]);

  localeMessages = this.messagesEn;

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
    private fb: FormBuilder) {}

  ngOnInit(): void {

    if (this.getLang() === 'de') this.localeMessages = this.messagesDe;

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

  getLang(): string {
    const userLocale = localStorage.getItem('locale');
    const browserLocale = navigator.language.slice(0, 2);

    if (userLocale) {
      return userLocale;
    } else {
      return browserLocale;
    }
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
