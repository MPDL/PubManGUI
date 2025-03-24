import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeSourceGenreParams } from 'src/app/components/batch/interfaces/batch-params';
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

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    public valSvc: BatchValidatorsService, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) {}

  sourceGenres = Object.keys(SourceGenre).sort();
  sourceGenresTranslations = {};
  sourceGenresOptions: {value: string, option: string}[] = [];

  ngOnInit(): void { 
    this.loadTranslations(this.locale)
      .then(() => {
        this.sourceGenres.forEach((value) => {
          let keyT = value as keyof typeof this.sourceGenresTranslations;
          this.sourceGenresOptions.push({'value': keyT, 'option': this.sourceGenresTranslations[keyT]})
        })
      })
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.sourceGenresTranslations = msgs.SourceGenre;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.sourceGenresTranslations = msgs.SourceGenre;
      })
    } 
  }

  public changeSourceGenreForm: FormGroup = this.fb.group({
    sourceGenreFrom: ['Genre', [Validators.required]],
    sourceGenreTo: ['Genre', [Validators.required]],
  },
    { validators: [this.valSvc.notEqualsValidator('sourceGenreFrom', 'sourceGenreTo'), this.valSvc.allRequiredValidator()] });

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
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      //setTimeout(() => {this.changeSourceGenreForm.reset();}, 500);
      this.router.navigate(['/batch/logs']);
    });

  }
}
