import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { IdType } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { AddSourceIdentiferParams } from 'src/app/components/batch/interfaces/actions-params';

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

  constructor(
    private fb: FormBuilder, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  sourceIdTypes = Object.keys(IdType);

  public addSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1', [ Validators.required ]],
    sourceIdentifierType: ['', [ Validators.required ]],
    sourceIdentifier: ['', [ Validators.required ]],
  });

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
      this.msgSvc.info(`Action started!\n`);
      setTimeout(() => {this.addSourceIdentifierForm.controls['sourceIdentifier'].reset();},1000);
    });
  }
 }