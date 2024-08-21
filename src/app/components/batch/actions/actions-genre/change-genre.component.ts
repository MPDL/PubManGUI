import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeGenreParams } from 'src/app/components/batch/interfaces/actions-params';
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

  constructor(
    private fb: FormBuilder, 
    public valSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) {}

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
      setTimeout(() => { this.changeGenreForm.reset(); }, 500);
    });
    
  }

}