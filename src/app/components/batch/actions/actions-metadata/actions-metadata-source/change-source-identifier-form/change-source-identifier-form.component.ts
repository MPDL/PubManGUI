import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeSourceIdentifierParams } from 'src/app/components/batch/interfaces/actions-params';
import { IdType } from 'src/app/model/inge';

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

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  sourceIdTypes = Object.keys(IdType);

  public changeSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['', [ Validators.required ]],
    sourceIdentifierType: ['', [ Validators.required ]],
    sourceIdentifierFrom: ['', [ Validators.required ]],
    sourceIdentifierTo: ['', [ Validators.required ]], 
  },
  {
    validators: this.vs.notEqualsValidator('sourceIdentifierFrom', 'sourceIdentifierTo')
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

    this.bs.changeSourceIdentifier(this.changeSourceIdentifierParams).subscribe( actionResponse => console.log(actionResponse));
  }
}
