import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { SourceGenre } from 'src/app/model/inge';

@Component({
  selector: 'pure-change-source-genre-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-source-genre-form.component.html',
})
export class ChangeSourceGenreFormComponent {

  constructor(private fb: FormBuilder) { }

  sourceGenres = Object.keys(SourceGenre);

  // changeSourceGenre(List<String> itemIds, SourceVO.Genre sourceGenreFrom, SourceVO.Genre sourceGenreTo, String userId, String token);
  public changeSourceGenreForm: FormGroup = this.fb.group({
    sourceGenreFrom: ['', [Validators.required]],
    sourceGenreTo: ['', [Validators.required]],
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
    if (this.changeSourceGenreForm.invalid) {
      this.changeSourceGenreForm.markAllAsTouched();
      return;
    }

    console.log(this.changeSourceGenreForm.value);
  }
}
