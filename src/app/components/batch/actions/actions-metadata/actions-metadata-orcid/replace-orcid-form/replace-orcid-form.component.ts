import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-replace-orcid-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-orcid-form.component.html',
})
export class ReplaceOrcidFormComponent {

  constructor(private fb: FormBuilder) { }

  // changeOrcid(List<String> itemIds, String creatorId, String orcid, String userId, String token);
  public changeOrcidForm: FormGroup = this.fb.group({
    creatorId: ['', [ Validators.required ]],
    orcid: ['', [ Validators.required ]],
  });

  // TO-DO
  public personSearch: string = "";

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
    if (this.changeOrcidForm.invalid) {
      this.changeOrcidForm.markAllAsTouched();
      return;
    }

    console.log(this.changeOrcidForm.value);
  }

 }
