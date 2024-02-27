import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ReviewMethod } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/actions-params';


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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: ['', [ Validators.required ]],
    reviewMethodTo: ['', [ Validators.required ]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['reviewMethodFrom'].value;
    const to = formGroup.controls['reviewMethodTo'].value;
    if (formGroup.controls['reviewMethodTo'].dirty) {
      if (from === to) {
        formGroup.controls['reviewMethodTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('reviewMethodTo')?.setErrors(null);
    return null;
  } 

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
