import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ContextDbVO, ContextState, ItemVersionState, ItemVersionVO, Workflow } from "../../../model/inge";
import { ItemsService } from "../../../services/pubman-rest-client/items.service";
import { MessageService } from "../../../services/message.service";
import { catchError, EMPTY, finalize, Subscription, tap } from "rxjs";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { SanitizeHtmlPipe } from "../../../pipes/sanitize-html.pipe";
import { PubManHttpErrorResponse } from "../../../services/interceptors/http-error.interceptor";
import { AaService } from "../../../services/aa.service";
import { removeDuplicates } from "../../../utils/utils";
import { ChipsComponent } from "../chips/chips.component";
import { FormBuilderService } from "../../../services/form-builder.service";
import { NotificationComponent } from "../notification/notification.component";

@Component({
  selector: 'pure-item-actions-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    SanitizeHtmlPipe,
    ChipsComponent,
    NotificationComponent
  ],
  templateUrl: './update-localtags-modal.component.html'
})
export class UpdateLocaltagsModalComponent {

  @Input() item!: ItemVersionVO;
  @Output() successfullyDone: EventEmitter<ItemVersionVO> = new EventEmitter();


  formGroup: FormGroup;
  tmpLocalTags: string[] = []

  errorMessage: any = undefined;

  loading = false;

  private subscription?: Subscription;

  constructor(protected activeModal: NgbActiveModal, private itemsService: ItemsService, private messageService: MessageService, private translateService: TranslateService, protected aaService: AaService, private formBuilder: FormBuilder) {

    this.formGroup = this.formBuilder.group({
      localTags: this.formBuilder.control(this.tmpLocalTags)
    })
  }

  ngOnInit() {
    this.tmpLocalTags = this.item.localTags ? [...this.item.localTags] : [];
  }


  closeModal() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }

  go() {
    this.loading = true;

    console.log(this.tmpLocalTags)


      this.subscription = this.itemsService.updateLocalTags(this.item!.objectId!, this.tmpLocalTags)
        .pipe(
          tap(data => {
            this.messageService.success(this.translateService.instant('common.updateLocalTags') + " successful");
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
