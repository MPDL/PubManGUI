import { CommonModule } from '@angular/common';
import { Component, inject, Inject, LOCALE_ID } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeGenreParams } from 'src/app/components/batch/interfaces/batch-params';
import { MdsPublicationGenre, DegreeType } from 'src/app/model/inge';

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
    router = inject(Router);
    fb = inject(FormBuilder);
    batchSvc = inject(BatchService);
    valSvc = inject(BatchValidatorsService); 
    //msgSvc = inject(MessageService);

  constructor(
    @Inject(LOCALE_ID) public locale: string
  ) {}

  genres = Object.keys(MdsPublicationGenre).sort();
  genresTranslations = {};
  genresOptions: {value: string, option: string}[] = [];

  degreeTypes = Object.keys(DegreeType); 
  degreeTypesTranslations = {};
  degreeTypesOptions: {value: string, option: string}[] = [];

  ngOnInit(): void { 
    this.loadTranslations(this.locale)
      .then(() => {
        this.genres.forEach((value) => {
          let keyT = value as keyof typeof this.genresTranslations;
          this.genresOptions.push({'value': keyT, 'option': this.genresTranslations[keyT]})
        })
        this.degreeTypes.forEach((value) => {
          let keyT = value as keyof typeof this.degreeTypesTranslations;
          this.degreeTypesOptions.push({'value': keyT, 'option': this.degreeTypesTranslations[keyT]})
        })
      })
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.genresTranslations = msgs.MdsPublicationGenre;
        this.degreeTypesTranslations = msgs.DegreeType;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.genresTranslations = msgs.MdsPublicationGenre;
        this.degreeTypesTranslations = msgs.DegreeType;
      })
    } 
  }

  public changeGenreForm: FormGroup = this.fb.group({
    genreFrom: ['Genre', [Validators.required]],
    genreTo: ['Genre', [Validators.required]],
    degreeType: [{value: '', disabled: true}],
    }, 
    { validators: [this.valSvc.notEqualsValidator('genreFrom','genreTo'), this.valSvc.allRequiredValidator()] }
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
    this.batchSvc.changeGenre(this.changeGenreParams).subscribe( actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.changeGenreForm.reset();
      this.router.navigate(['/batch/logs']);
    });       
  }

}