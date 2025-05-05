import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ItemVersionVO} from "../../../model/inge";
import {ItemsService} from "../../../services/pubman-rest-client/items.service";
import {MessageService} from "../../services/message.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'pure-item-actions-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './item-actions-modal.component.html'
})
export class ItemActionsModalComponent {

  @Input() item!: ItemVersionVO;
  @Input() action!: 'release' | 'submit' | 'revise' | 'withdraw' | 'delete' | 'addDoi';
  @Output() successfullyDone: EventEmitter<string> = new EventEmitter();

  protected comment : string = '';

  protected errorMessage: string = '';

  protected loading = false;

  constructor(protected activeModal: NgbActiveModal, private itemsService: ItemsService, private messageService: MessageService, private router: Router) {
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
    }
    if(obs) {
      obs.subscribe({
          next: (data: any) => {
            this.messageService.success(this.action + " successful");
            this.activeModal.close();
            this.successfullyDone.emit(data);
          },
          error: (error) => {
            this.errorMessage = error;
          }
        }
      )
        .add(
          () => {
            console.log("completed")
            this.loading = false;
          }
        )
    }
    this.successfullyDone.emit(this.comment);
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

}
