import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { AddKeywordsParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-add-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-keywords-form.component.html',
})
export class AddKeywordsFormComponent {
  
  constructor(
    private fb: FormBuilder, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  public addKeywordsForm: FormGroup = this.fb.group({
    keywords: ['', [ Validators.required ]],
  });

  // TO-DO Check that words don't repeat

  get addKeywordsParams(): AddKeywordsParams {
    const actionParams: AddKeywordsParams = {
      keywords: this.addKeywordsForm.controls['keywords'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.addKeywordsForm.invalid) {
      this.addKeywordsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.addKeywords(this.addKeywordsParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
      setTimeout(() => {this.addKeywordsForm.reset();},1000);
    });
  }
}
