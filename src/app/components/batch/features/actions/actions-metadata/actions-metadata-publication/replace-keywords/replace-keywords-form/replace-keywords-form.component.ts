import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
//import { MessageService } from 'src/app/shared/services/message.service';
import type { ReplaceKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

@Component({
  selector: 'pure-replace-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './replace-keywords-form.component.html',
})
export class ReplaceKeywordsFormComponent {

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private batchSvc: BatchService,
    //private msgSvc: MessageService
  ) { }

  public replaceKeywordsForm: FormGroup = this.fb.group({
    keywords: ['', [ Validators.required ]],
  });

  get replaceKeywordsParams(): ReplaceKeywordsParams {
    const actionParams: ReplaceKeywordsParams = {
      keywords: this.replaceKeywordsForm.controls['keywords'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceKeywordsForm.invalid) {
      this.replaceKeywordsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.replaceKeywords(this.replaceKeywordsParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      //setTimeout(() => {this.replaceKeywordsForm.reset();}, 500);
      this.router.navigate(['/batch/logs']);
    });
  }

 }
