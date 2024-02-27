import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SourceGenre } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeSourceGenreParams } from 'src/app/components/batch/interfaces/actions-params';

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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  sourceGenres = Object.keys(SourceGenre);

  public changeSourceGenreForm: FormGroup = this.fb.group({
    sourceGenreFrom: ['', [Validators.required]],
    sourceGenreTo: ['', [Validators.required]],
  });

  get changeSourceGenreParams(): ChangeSourceGenreParams {
    const actionParams: ChangeSourceGenreParams = {
      sourceGenreFrom: this.changeSourceGenreForm.controls['sourceGenreFrom'].value,
      sourceGenreTo: this.changeSourceGenreForm.controls['sourceGenreTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeSourceGenreForm.invalid) {
      this.changeSourceGenreForm.markAllAsTouched();
      return;
    }

    this.bs.changeSourceGenre(this.changeSourceGenreParams).subscribe( actionResponse => console.log(actionResponse));
  }
}
