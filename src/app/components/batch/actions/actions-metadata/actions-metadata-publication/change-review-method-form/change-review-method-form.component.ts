import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/actions-params';
import { ReviewMethod } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-review-method-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-review-method-form.component.html',
})
export class ChangeReviewMethodFormComponent {

  reviewMethods = Object.keys(ReviewMethod);

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: ['Review type', [ Validators.required ]],
    reviewMethodTo: ['Review type', [ Validators.required ]],
  }, 
  { validators: this.validSvc.notEqualsValidator('reviewMethodFrom','reviewMethodTo') });

  get changeReviewMethodParams(): ChangeReviewMethodParams {
    const actionParams: ChangeReviewMethodParams = {
      reviewMethodFrom: this.changeReviewMethodForm.controls['reviewMethodFrom'].value,
      reviewMethodTo: this.changeReviewMethodForm.controls['reviewMethodTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeReviewMethodForm.invalid) {
      this.changeReviewMethodForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeReviewMethod(this.changeReviewMethodParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
    });
  }
 }
