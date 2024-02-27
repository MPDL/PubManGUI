import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ReplaceKeywordsParams } from 'src/app/components/batch/interfaces/actions-params';

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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public replaceKeywordsForm: FormGroup = this.fb.group({
    publicationKeywordsTo: ['', [ Validators.required ]],
  });

  get replaceKeywordsParams(): ReplaceKeywordsParams {
    const actionParams: ReplaceKeywordsParams = {
      publicationKeywordsTo: this.replaceKeywordsForm.controls['publicationKeywordsTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceKeywordsForm.invalid) {
      this.replaceKeywordsForm.markAllAsTouched();
      return;
    }

    this.bs.replaceKeywords(this.replaceKeywordsParams).subscribe( actionResponse => console.log(actionResponse));
  }

 }
