import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MdsPublicationGenre, DegreeType } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeGenreParams } from 'src/app/components/batch/interfaces/actions-params';


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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  genres = Object.keys(MdsPublicationGenre);
  degreeTypes = Object.keys(DegreeType);

  public changeGenreForm: FormGroup = this.fb.group({
    genreFrom: ['', [Validators.required]],
    genreTo: ['', [Validators.required]],
    degreeType: ['', [Validators.required]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['genreFrom'].value;
    const to = formGroup.controls['genreTo'].value;
    if (formGroup.controls['genreTo'].dirty) {
      if (from === to) {
        formGroup.controls['genreTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('genreTo')?.setErrors(null);
    return null;
  }

  get changeGenreParams(): ChangeGenreParams {
    const actionParams: ChangeGenreParams = {
      genreFrom: this.changeGenreForm.controls['genreFrom'].value,
      genreTo: this.changeGenreForm.controls['genreTo'].value,
      degreeType: this.changeGenreForm.controls['degreeType'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeGenreForm.invalid) {
      this.changeGenreForm.markAllAsTouched();
      return;
    }

    this.bs.changeGenre(this.changeGenreParams).subscribe( actionResponse => console.log(actionResponse));
  }

}