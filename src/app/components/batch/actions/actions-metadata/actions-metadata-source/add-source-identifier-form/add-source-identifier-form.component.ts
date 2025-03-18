import { CommonModule } from '@angular/common';
import { Component, inject, Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { IdType } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { AddSourceIdentiferParams } from 'src/app/components/batch/interfaces/batch-params';


@Component({
  selector: 'pure-add-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-source-identifier-form.component.html',
})
export class AddSourceIdentifierFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  //msgSvc = inject(MessageService);

  constructor(
    @Inject(LOCALE_ID) public locale: string) {}

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

  public addSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1'],
    sourceIdentifierType: [$localize`:@@batch.actions.metadata.source.addId.default:Type`, Validators.required],
    sourceIdentifier: ['', [ Validators.required, Validators.minLength(1) ]]
  },
    { validators: this.valSvc.allRequiredValidator() }
  );

  get addSourceIdentifierParams(): AddSourceIdentiferParams {
    const actionParams: AddSourceIdentiferParams = {
      sourceNumber: this.addSourceIdentifierForm.controls['sourceNumber'].value,
      sourceIdentifierType: this.addSourceIdentifierForm.controls['sourceIdentifierType'].value,
      sourceIdentifier: this.addSourceIdentifierForm.controls['sourceIdentifier'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.addSourceIdentifierForm.invalid) {
      this.addSourceIdentifierForm.markAllAsTouched();
      return;
    }

    this.batchSvc.addSourceIdentifer(this.addSourceIdentifierParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      //setTimeout(() => {this.addSourceIdentifierForm.controls['sourceIdentifier'].reset();}, 500);
      this.router.navigate(['/batch/logs']);
    });
  }
 }