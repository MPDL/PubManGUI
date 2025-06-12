import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ItemVersionVO} from "../../../model/inge";
import {ItemsService} from "../../../services/pubman-rest-client/items.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {Observable, Subscription} from "rxjs";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LoadingComponent} from "../loading/loading.component";
import {SanitizeHtmlPipe} from "../../services/pipes/sanitize-html.pipe";

@Component({
  selector: 'pure-item-actions-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    LoadingComponent,
    SanitizeHtmlPipe
  ],
  templateUrl: './item-actions-modal.component.html'
})
export class ItemActionsModalComponent {

  @Input() item!: ItemVersionVO;
  @Input() action!: 'release' | 'submit' | 'revise' | 'withdraw' | 'delete' | 'addDoi' | 'rollback';
  @Input() rollbackVersion?: number;
  @Output() successfullyDone: EventEmitter<string> = new EventEmitter();

  protected comment : string = '';

  protected errorMessage: string = '';

  protected loading = false;

  private subscription?: Subscription;

  constructor(protected activeModal: NgbActiveModal, private itemsService: ItemsService, private messageService: MessageService, private router: Router, private translateService: TranslateService) {
  }

  closeModal() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
    this.activeModal.dismiss();
  }

  go() {
    this.loading = true;
    let obs: Observable<any>|undefined = undefined;
    switch(this.action) {
      case 'release': {
        obs = this.release();
        break;
      }
      case "submit": {
        obs = this.submit();
        break;
      }
      case 'revise': {
        obs = this.revise();
        break;
      }
      case 'withdraw': {
        obs = this.withdraw();
        break;
      }
      case "delete": {
        obs = this.delete();
        break;
      }
      case "addDoi": {
        obs = this.addDoi();
        break;
      }
      case "rollback": {
        obs = this.rollback();
        break;
      }
    }
    if(obs) {
      this.subscription = obs.subscribe({
          next: (data: any) => {
            this.messageService.success(this.translateService.instant('common.' + this.action) + " successful");
            this.activeModal.close();
            this.successfullyDone.emit(data);
          },
          error: (error) => {
            this.errorMessage = error;
          }
        }
      );
        this.subscription.add(
          () => {
            console.log("completed")
            this.loading = false;
          }
        )
    }
    //this.successfullyDone.emit(this.comment);
  }

  submit() {
    return this.itemsService.submit(this.item!.objectId!, this.item!.lastModificationDate!, this.comment);
  }

  release() {
    return this.itemsService.release(this.item!.objectId!, this.item!.lastModificationDate!, this.comment);
  }

  revise() {
    return this.itemsService.revise(this.item!.objectId!, this.item!.lastModificationDate!, this.comment);
  }

  withdraw() {
    return this.itemsService.withdraw(this.item!.objectId!, this.item!.lastModificationDate!, this.comment);
  }

  delete() {
    return this.itemsService.delete(this.item!.objectId!, this.item!.lastModificationDate!);
  }

  addDoi() {
    return this.itemsService.addDoi(this.item!.objectId!);
  }

  rollback() {
    return this.itemsService.rollback(this.item!.objectId!, this.rollbackVersion!);
  }

}
