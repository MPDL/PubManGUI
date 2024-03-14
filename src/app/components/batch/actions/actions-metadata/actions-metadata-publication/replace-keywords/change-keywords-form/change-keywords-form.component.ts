import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeKeywordsParams } from 'src/app/components/batch/interfaces/actions-params';

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

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  public changeKeywordsForm: FormGroup = this.fb.group({
    keywordsFrom: ['', [ Validators.required ]],
    keywordsTo: ['', [ Validators.required ]],
  }, 
  { validators: this.vs.notEqualsValidator('keywordsFrom','keywordsTo') });

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

    this.bs.changeKeywords(this.changeKeywordsParams).subscribe( actionResponse => console.log(actionResponse));
  }
}
