import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeLocalTagParams } from 'src/app/components/batch/interfaces/actions-params';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'pure-change-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-local-tags-form.component.html',
})
export class ChangeLocalTagsFormComponent {

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: ['', [Validators.required]],
    localTagTo: ['', [Validators.required]],
  },
    {
      validators: this.validSvc.notEqualsValidator('localTagFrom', 'localTagTo')
    });


  get changeLocalTagsParams(): ChangeLocalTagParams {
    const actionParams: ChangeLocalTagParams = {
      localTagFrom: this.changeLocalTagsForm.controls['localTagFrom'].value,
      localTagTo: this.changeLocalTagsForm.controls['localTagTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeLocalTagsForm.invalid) {
      this.changeLocalTagsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeLocalTags(this.changeLocalTagsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      setTimeout(() => {this.changeLocalTagsForm.reset();}, 500);
    });
  }

}