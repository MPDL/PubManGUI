import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/actions-params';
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

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: ['', [ Validators.required ]],
    reviewMethodTo: ['', [ Validators.required ]],
  }, 
  { validators: this.vs.notEqualsValidator('reviewMethodFrom','reviewMethodTo') });

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

    this.bs.changeReviewMethod(this.changeReviewMethodParams).subscribe( actionResponse => console.log(actionResponse));
  }
 }
