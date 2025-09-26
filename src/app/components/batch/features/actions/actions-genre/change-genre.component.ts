import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeGenreParams } from 'src/app/components/batch/interfaces/batch-params';
import { DegreeType, MdsPublicationGenre } from 'src/app/model/inge';

import { TranslatePipe } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-batch-change-genre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-genre.component.html',
})
export class ActionsGenreComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  valSvc = inject(BatchValidatorsService);

  genres = Object.keys(MdsPublicationGenre).sort();
  degreeTypes = Object.keys(DegreeType);

  public changeGenreForm: FormGroup = this.fb.group({
    genreFrom: [null, [Validators.required]],
    genreTo: [null, [Validators.required]],
    degreeType: [{ value: null, disabled: true }],
  },
    { validators: [this.valSvc.notSameValues('genreFrom', 'genreTo')] }
  );

  get changeGenreParams(): ChangeGenreParams {
    const actionParams: ChangeGenreParams = {
      genreFrom: this.changeGenreForm.controls['genreFrom'].value,
      genreTo: this.changeGenreForm.controls['genreTo'].value,
      degreeType: this.changeGenreForm.controls['degreeType'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.changeGenreForm.reset();
  }

  onSubmit(): void {
    if (this.changeGenreForm.valid) {
      this.batchSvc.changeGenre(this.changeGenreParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.changeGenreForm.reset();
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (this.changeGenreForm.invalid) {
      Object.keys(this.changeGenreForm.controls).forEach(key => {
        const field = this.changeGenreForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

}
