import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pure-replace-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-keywords-form.component.html',
})
export class ReplaceKeywordsFormComponent {

  constructor(private fb: FormBuilder) { }

  // replaceAllKeywords(List<String> itemIds, String publicationKeywordsTo, String userId, String token);
  public replaceAllKeywordsForm: FormGroup = this.fb.group({
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
    if (this.replaceAllKeywordsForm.invalid) {
      this.replaceAllKeywordsForm.markAllAsTouched();
      return;
    }

    console.log(this.replaceAllKeywordsForm.value);
  }

 }
