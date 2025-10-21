import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ContextDbVO, ContextState, ItemVersionState, ItemVersionVO, Workflow } from "../../../model/inge";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { Message, MessageService } from "../../../services/message.service";
import { catchError, EMPTY, finalize, Subscription, tap } from "rxjs";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { SanitizeHtmlPipe } from "../../../pipes/sanitize-html.pipe";
import { PubManHttpErrorResponse } from "../../../services/interceptors/http-error.interceptor";
import { AaService } from "../../../services/aa.service";
import { removeDuplicates } from "../../../utils/utils";
import { NotificationComponent } from "../notification/notification.component";

@Component({
  selector: 'pure-item-actions-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    SanitizeHtmlPipe,
    NotificationComponent
  ],
  templateUrl: './change-context-modal.component.html'
})
export class ChangeContextModalComponent {

  @Input() item!: ItemVersionVO;
  @Output() successfullyDone: EventEmitter<ItemVersionVO> = new EventEmitter();


  contextList : {context: ContextDbVO, invalid:boolean }[] = [];
  selectedContextId = '';

  errorMessage?: Message;

  loading = false;

  private subscription?: Subscription;

  constructor(protected activeModal: NgbActiveModal, private itemsService: ItemsService, private messageService: MessageService, private translateService: TranslateService, protected aaService: AaService) {

  }

  ngOnInit() {
    this.selectedContextId = this.item.context!.objectId!;
    let allContextsWithoutDuplicates = this.aaService.principal.value.depositorContexts.concat(this.aaService.principal.value.moderatorContexts);
    allContextsWithoutDuplicates = removeDuplicates(allContextsWithoutDuplicates, 'objectId');
    this.contextList =
      allContextsWithoutDuplicates
        .map(context => {
          return {
            context: context,
            invalid: this.isInvalid(context)
          }
        })
  }

  get canSubmit():boolean {
    return !this.contextList.find(ce => ce.context.objectId === this.selectedContextId)?.invalid;

  }

  private isInvalid(context: ContextDbVO) {
    return context.state === ContextState.CLOSED
    || context.objectId === this.item.context!.objectId
    || this.item.latestVersion!.versionState === ItemVersionState.IN_REVISION
    || (this.item.latestVersion!.versionState === ItemVersionState.PENDING && !this.aaService.principal.value.isDepositorForContext(context.objectId!))
    || this.item.publicState === ItemVersionState.WITHDRAWN
    || (this.item.publicState === ItemVersionState.SUBMITTED && context.workflow === Workflow.SIMPLE)
    || !context.allowedGenres
    || context.allowedGenres.length === 0
    || !(context.allowedGenres.includes(this.item.metadata!.genre!))
  }

  closeModal() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }

  go() {
    this.loading = true;


      this.subscription = this.itemsService.changeContext(this.item!.objectId!, this.selectedContextId)
        .pipe(
          tap(data => {
            this.messageService.success(this.translateService.instant('common.changeContext') + " " + this.translateService.instant('common.succeeded'), true);
            this.activeModal.close();
            this.successfullyDone.emit(data);
          }),
          catchError((err: PubManHttpErrorResponse) => {
            this.errorMessage = this.messageService.httpErrorToMessage(err);
            return EMPTY;
          }),
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe();

    //this.successfullyDone.emit(this.comment);
  }


}
