import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-change-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-keywords-form.component.html',
})
export class ChangeKeywordsFormComponent { 

  constructor(private fb: FormBuilder) { }

  // changeKeywords(List<String> itemIds, String publicationKeywordsFrom, String publicationKeywordsTo, String userId, String token);
  public changeKeywordsForm: FormGroup = this.fb.group({
    publicationKeywordsFrom: ['', [ Validators.required ]],
    publicationKeywordsTo: ['', [ Validators.required ]],
  });

  isValidField( form: FormGroup, field: string ): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray( formArray: FormArray, index: number ) {
    return formArray.controls[index].errors
        && formArray.controls[index].touched;
  }

  getFieldError( form: FormGroup, field: string ): string | null {
    if ( !form.controls[field] ) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors) ) {
      switch( key ) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${ errors['minlength'].requiredLength } characters required!`;
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.changeKeywordsForm.invalid) {
      this.changeKeywordsForm.markAllAsTouched();
      return;
    }

    console.log(this.changeKeywordsForm.value);
  }
}
