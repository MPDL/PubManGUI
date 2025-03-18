import { CommonModule } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { IdType } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeSourceIdentifierParams } from 'src/app/components/batch/interfaces/batch-params';


@Component({
  selector: 'pure-change-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-source-identifier-form.component.html',
})
export class ChangeSourceIdentifierFormComponent { 

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    public valSvc: BatchValidatorsService, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService,
    @Inject(LOCALE_ID) public locale: string) { }

  sourceIdTypes = Object.keys(IdType);
  sourceIdTypesTranslations = {};
  sourceIdTypesOptions: {value: string, option: string}[] = [];

  ngOnInit(): void { 
    this.loadTranslations(this.locale)
      .then(() => {
        this.sourceIdTypes.sort((a,b) => b[1].localeCompare(a[1])).forEach((value) => {
          let keyT = value as keyof typeof this.sourceIdTypesTranslations;
          if(this.sourceIdTypesTranslations[keyT]) {
            this.sourceIdTypesOptions.push({'value': keyT, 'option': this.sourceIdTypesTranslations[keyT]})
          }
        })
      })
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.sourceIdTypesTranslations = msgs.SourceIdType;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.sourceIdTypesTranslations = msgs.SourceIdType;
      })
    } 
  }

  public changeSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1'],
    sourceIdentifierType: [$localize`:@@batch.actions.metadata.source.replaceId.default:Type`, Validators.required ],
    sourceIdentifierFrom: ['', [ Validators.required, Validators.minLength(1) ]],
    sourceIdentifierTo: [''], 
  },
  {
    validators: [ this.valSvc.notEqualsValidator('sourceIdentifierFrom', 'sourceIdentifierTo'), this.valSvc.allRequiredValidator() ]
  });

  get changeSourceIdentifierParams(): ChangeSourceIdentifierParams {
    const actionParams: ChangeSourceIdentifierParams = {
      sourceNumber: this.changeSourceIdentifierForm.controls['sourceNumber'].value,
      sourceIdentifierType: this.changeSourceIdentifierForm.controls['sourceIdentifierType'].value,
      sourceIdentifierFrom: this.changeSourceIdentifierForm.controls['sourceIdentifierFrom'].value,
      sourceIdentifierTo: this.changeSourceIdentifierForm.controls['sourceIdentifierTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeSourceIdentifierForm.invalid) {
      this.changeSourceIdentifierForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeSourceIdentifier(this.changeSourceIdentifierParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      /*
      setTimeout(() => {
        this.changeSourceIdentifierForm.controls['sourceIdentifierFrom'].reset();
      }, 500);
      setTimeout(() => {
        this.changeSourceIdentifierForm.controls['sourceIdentifierTo'].reset();
      }, 500);
      */
      this.router.navigate(['/batch/logs']);
    });
  }
}
