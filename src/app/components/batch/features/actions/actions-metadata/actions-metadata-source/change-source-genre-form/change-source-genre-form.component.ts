import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeSourceGenreParams } from 'src/app/components/batch/interfaces/batch-params';
import { SourceGenre } from 'src/app/model/inge';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-source-genre-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-source-genre-form.component.html',
})
export class ChangeSourceGenreFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);

  sourceGenres = Object.keys(SourceGenre).sort();

  public changeSourceGenreForm: FormGroup = this.fb.group({
    sourceGenreFrom: ['Genre', [Validators.required]],
    sourceGenreTo: ['Genre', [Validators.required]],
  }, {
    validators: [this.valSvc.notEqualsValidator('sourceGenreFrom', 'sourceGenreTo'), this.valSvc.allRequiredValidator()]
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

    this.batchSvc.changeSourceGenre(this.changeSourceGenreParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });

  }
}
