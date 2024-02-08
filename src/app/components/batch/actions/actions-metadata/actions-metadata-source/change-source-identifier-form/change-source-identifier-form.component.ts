import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { IdType } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-source-identifier-form.component.html',
})
export class ChangeSourceIdentifierFormComponent { 

  constructor(private fb: FormBuilder) { }

  sourceIdTypes = Object.keys(IdType);

  // changeSourceIdentifier(List<String> itemIds, String sourceNumber, IdentifierVO.IdType identifierType, String identifierFrom, String identifierTo, String userId, String token);
  public changeSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['', [ Validators.required ]],
    identifierType: ['', [ Validators.required ]],
    identifierFrom: ['', [ Validators.required ]],
    identifierTo: ['', [ Validators.required ]], 
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
    if (this.changeSourceIdentifierForm.invalid) {
      this.changeSourceIdentifierForm.markAllAsTouched();
      return;
    }

    console.log(this.changeSourceIdentifierForm.value);
  }
}
