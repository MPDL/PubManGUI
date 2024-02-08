import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-add-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-keywords-form.component.html',
})
export class AddKeywordsFormComponent {
  
  constructor(private fb: FormBuilder) { }

  // addKeywords(List<String> itemIds, String publicationKeywords, String userId, String token);
  public addKeywordsForm: FormGroup = this.fb.group({
    publicationKeywords: ['', [ Validators.required ]],
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
    if (this.addKeywordsForm.invalid) {
      this.addKeywordsForm.markAllAsTouched();
      return;
    }

    console.log(this.addKeywordsForm.value);
  }

}
