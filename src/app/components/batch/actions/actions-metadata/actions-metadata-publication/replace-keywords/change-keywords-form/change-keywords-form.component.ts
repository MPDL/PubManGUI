import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public changeKeywordsForm: FormGroup = this.fb.group({
    publicationKeywordsFrom: ['', [ Validators.required ]],
    publicationKeywordsTo: ['', [ Validators.required ]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['publicationKeywordsFrom'].value;
    const to = formGroup.controls['publicationKeywordsTo'].value;
    if (formGroup.controls['publicationKeywordsTo'].dirty) {
      if (from === to) {
        formGroup.controls['publicationKeywordsTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('publicationKeywordsTo')?.setErrors(null);
    return null;
  } 

  get changeKeywordsParams(): ChangeKeywordsParams {
    const actionParams: ChangeKeywordsParams = {
      publicationKeywordsFrom: this.changeKeywordsForm.controls['publicationKeywordsFrom'].value,
      publicationKeywordsTo: this.changeKeywordsForm.controls['publicationKeywordsTo'].value,
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
