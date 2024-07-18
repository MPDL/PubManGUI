import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeGenreParams } from 'src/app/components/batch/interfaces/actions-params';
import { MdsPublicationGenre, DegreeType, BatchProcessLogHeaderState } from 'src/app/model/inge';


@Component({
  selector: 'pure-batch-change-genre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-genre.component.html',
})
export class ActionsGenreComponent { 

  constructor(
    private fb: FormBuilder, 
    public valSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private router: Router) { }

  genres = Object.keys(MdsPublicationGenre);
  degreeTypes = Object.keys(DegreeType); 
  state = BatchProcessLogHeaderState;   


  public changeGenreForm: FormGroup = this.fb.group({
    /*
    genreFrom: [Object.keys(MdsPublicationGenre)[0], [Validators.required]],
    genreTo: [Object.keys(MdsPublicationGenre)[0], [Validators.required]],
    */
    genreFrom: ['Genre', [Validators.required]],
    genreTo: ['Genre', [Validators.required]],
    degreeType: [{value: '', disabled: true}],
    }, 
    // { validators: this.valSvc.notEqualsValidator('genreFrom','genreTo') }
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

  onSubmit(): void {
    if (this.changeGenreForm.invalid) {
      this.changeGenreForm.markAllAsTouched();
      return;
    }
    console.log("changeGenreParams: " + JSON.stringify(this.changeGenreParams));

    this.batchSvc.changeGenre(this.changeGenreParams).subscribe( actionResponse => {
      // console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      /*
      if (actionResponse.state === this.state.FINISHED) {
        this.msgSvc.info(`Action finished!\n`);
      }
      */
      setTimeout(() => { this.changeGenreForm.reset(); }, 500);
      this.router.navigate(['/batch']);
    });
    
  }

}