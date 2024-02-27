import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
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
  
  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public addKeywordsForm: FormGroup = this.fb.group({
    publicationKeywords: ['', [ Validators.required ]],
  });

  get addKeywordsParams(): AddKeywordsParams {
    const actionParams: AddKeywordsParams = {
      publicationKeywords: this.addKeywordsForm.controls['publicationKeywords'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.addKeywordsForm.invalid) {
      this.addKeywordsForm.markAllAsTouched();
      return;
    }

    this.bs.addKeywords(this.addKeywordsParams).subscribe( actionResponse => console.log(actionResponse));
  }
}
