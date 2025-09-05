import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-add-multiple-creators-modal',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './add-multiple-creators-modal.component.html',
  styleUrl: './add-multiple-creators-modal.component.scss'
})
export class AddMultipleCreatorsModalComponent {
  @Input() callback!: (creators: string) => void;

  multipleCreators: string = '';

  constructor(protected activeModal: NgbActiveModal, private translateService: TranslateService) {
  }

  closeModal() {
    this.activeModal.dismiss();
  }

  triggerCallback() {
    if (this.callback) {
      this.callback(this.multipleCreators);
    }
    this.closeModal();
  }


}
