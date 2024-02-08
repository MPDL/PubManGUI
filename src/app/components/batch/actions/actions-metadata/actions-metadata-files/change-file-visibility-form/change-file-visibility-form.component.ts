import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { Visibility } from '../../../../../../model/inge';

@Component({
  selector: 'pure-change-file-visibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-visibility-form.component.html',
})
export class ChangeFileVisibilityFormComponent {

  constructor(private fb: FormBuilder) { }

  visibilityTypes = Object.keys(Visibility);

  // changeFileVisibility(List<String> itemIds, Visibility filesVisibilityFrom, Visibility filesVisibilityTo, IpRange currentIp, String userId, String token);
  public changeFileVisibilityForm: FormGroup = this.fb.group({
    filesVisibilityFrom: ['', [Validators.required]],
    filesVisibilityTo: ['', [Validators.required]],
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
    if (this.changeFileVisibilityForm.invalid) {
      this.changeFileVisibilityForm.markAllAsTouched();
      return;
    }

    console.log(this.changeFileVisibilityForm.value);
  }
}
