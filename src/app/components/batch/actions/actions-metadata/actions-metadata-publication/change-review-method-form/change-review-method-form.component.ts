import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  // changeReviewMethod(List<String> itemIds, String reviewMethodFrom, String reviewMethodTo, String userId, String token);
  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: ['', [ Validators.required ]],
    reviewMethodTo: ['', [ Validators.required ]],
  });

  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${errors['minlength'].requiredLength} characters required!`;
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.changeReviewMethodForm.invalid) {
      this.changeReviewMethodForm.markAllAsTouched();
      return;
    }

    console.log(this.changeReviewMethodForm.value);
  }
 }
