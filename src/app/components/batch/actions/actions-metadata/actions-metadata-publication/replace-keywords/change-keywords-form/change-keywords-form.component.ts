import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ChangeKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

@Component({
  selector: 'pure-change-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-keywords-form.component.html',
})
export class ChangeKeywordsFormComponent { 

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    public valSvc: BatchValidatorsService, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService
  ) { }

  public changeKeywordsForm: FormGroup = this.fb.group({
    keywordsFrom: ['', [ Validators.required ]],
    keywordsTo: ['', [ Validators.required ]],
  }, 
  { validators: this.valSvc.notEqualsValidator('keywordsFrom','keywordsTo') });

  // TO-DO if multiple words? check if they don't repeat

  get changeKeywordsParams(): ChangeKeywordsParams {
    const actionParams: ChangeKeywordsParams = {
      keywordsFrom: this.changeKeywordsForm.controls['keywordsFrom'].value,
      keywordsTo: this.changeKeywordsForm.controls['keywordsTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeKeywordsForm.invalid) {
      this.changeKeywordsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeKeywords(this.changeKeywordsParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      //setTimeout(() => {this.changeKeywordsForm.reset();}, 500);
      this.router.navigate(['/batch/logs']);
    });
  }
}
