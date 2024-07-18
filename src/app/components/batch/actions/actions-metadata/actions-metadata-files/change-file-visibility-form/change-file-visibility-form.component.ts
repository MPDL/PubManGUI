import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeFileVisibilityParams } from 'src/app/components/batch/interfaces/actions-params';
import { Visibility } from 'src/app/model/inge';


@Component({
  selector: 'pure-change-file-visibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-visibility-form.component.html',
})
export class ChangeFileVisibilityFormComponent {

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  visibilityTypes = Object.keys(Visibility);

  public changeFileVisibilityForm: FormGroup = this.fb.group({
    /*
    fileVisibilityFrom: [Object.keys(Visibility)[0], [Validators.required]],
    fileVisibilityTo: [Object.keys(Visibility)[0], [Validators.required]],
    */
    fileVisibilityFrom: ['Visibility', [Validators.required]],
    fileVisibilityTo: ['Visibility', [Validators.required]],
  }, 
  { validators: this.validSvc.notEqualsValidator('fileVisibilityFrom','fileVisibilityTo') });

  get changeFileVisibilityParams(): ChangeFileVisibilityParams {
    const actionParams: ChangeFileVisibilityParams = {
      fileVisibilityFrom: this.changeFileVisibilityForm.controls['fileVisibilityFrom'].value,
      fileVisibilityTo: this.changeFileVisibilityForm.controls['fileVisibilityTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileVisibilityForm.invalid) {
      this.changeFileVisibilityForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeFileVisibility(this.changeFileVisibilityParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
    });
  }
}
