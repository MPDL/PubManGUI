import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-replace-source-edition-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-source-edition-form.component.html',
})
export class ReplaceSourceEditionFormComponent {

  constructor(private fb: FormBuilder) { }

  // replaceSourceEdition(List<String> itemIds, String sourceNumber, String sourceEdition, String userId, String token);
  public replaceSourceEditionForm: FormGroup = this.fb.group({
    sourceNumber: ['', [ Validators.required ]],
    sourceEdition: ['', [ Validators.required ]],
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
    if (this.replaceSourceEditionForm.invalid) {
      this.replaceSourceEditionForm.markAllAsTouched();
      return;
    }

    console.log(this.replaceSourceEditionForm.value);
  }
 }
