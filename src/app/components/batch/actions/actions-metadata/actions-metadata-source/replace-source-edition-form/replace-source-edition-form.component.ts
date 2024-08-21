import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ReplaceSourceEditionParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-replace-source-edition-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-source-edition-form.component.html',
})
export class ReplaceSourceEditionFormComponent {

  constructor(
    private fb: FormBuilder, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  public replaceSourceEditionForm: FormGroup = this.fb.group({
    sourceNumber: ['1', [ Validators.required ]],
    sourceEdition: ['', [ Validators.required ]],
  });

  get replaceSourceEditionParams(): ReplaceSourceEditionParams {
    const actionParams: ReplaceSourceEditionParams = {
      sourceNumber: this.replaceSourceEditionForm.controls['sourceNumber'].value,
      edition: this.replaceSourceEditionForm.controls['sourceEdition'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceSourceEditionForm.invalid) {
      this.replaceSourceEditionForm.markAllAsTouched();
      return;
    }

    this.batchSvc.replaceSourceEdition(this.replaceSourceEditionParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);

      setTimeout(() => {this.replaceSourceEditionForm.controls['sourceEdition'].reset;}, 500);
    });
  }
 }
