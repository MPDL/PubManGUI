import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { MdsPublicationGenre, DegreeType } from 'src/app/model/inge';


@Component({
  selector: 'pure-actions-genre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './actions-genre.component.html',
})
export class ActionsGenreComponent { 

  constructor(private fb: FormBuilder) { }

  genres = Object.keys(MdsPublicationGenre);

  degreeTypes = Object.keys(DegreeType);

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

  // changeGenre(List<String> itemIds, Genre genreFrom, Genre genreTo, DegreeType degree, String userId, String token);
  public changeGenreForm: FormGroup = this.fb.group({
    genreFrom: ['', [Validators.required]],
    genreTo: ['', [Validators.required]],
    degree: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.changeGenreForm.invalid) {
      this.changeGenreForm.markAllAsTouched();
      return;
    }

    console.log(this.changeGenreForm.value);
  }


}
