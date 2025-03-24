import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeLocalTagParams } from 'src/app/components/batch/interfaces/batch-params';
//import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'pure-change-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-local-tags-form.component.html',
})
export class ChangeLocalTagsFormComponent {

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    public valSvc: BatchValidatorsService, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService
  ) { }

  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: ['', [Validators.required]],
    localTagTo: ['', [Validators.required]],
  },
    {
      validators: [this.valSvc.notEqualsValidator('localTagFrom', 'localTagTo'), this.valSvc.allRequiredValidator()]
    });


  get changeLocalTagsParams(): ChangeLocalTagParams {
    const actionParams: ChangeLocalTagParams = {
      localTagFrom: this.changeLocalTagsForm.controls['localTagFrom'].value,
      localTagTo: this.changeLocalTagsForm.controls['localTagTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeLocalTagsForm.invalid) {
      this.changeLocalTagsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeLocalTags(this.changeLocalTagsParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      //setTimeout(() => {this.changeLocalTagsForm.reset();}, 500);
      this.router.navigate(['/batch/logs']);
    });
  }

}