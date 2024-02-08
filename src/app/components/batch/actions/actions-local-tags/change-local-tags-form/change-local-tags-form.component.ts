import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }


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

  // changeLocalTags(List<String> itemIds, String localTagFrom, String localTagTo, String userId, String token);
  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: ['', [Validators.required]],
    localTagTo: ['', [Validators.required]],
  }); 

  onSubmit(): void {
    if (this.changeLocalTagsForm.invalid) {
      this.changeLocalTagsForm.markAllAsTouched();
      return;
    }

    console.log(this.changeLocalTagsForm.value);
    //this.changeLocalTags.reset();
  }

}