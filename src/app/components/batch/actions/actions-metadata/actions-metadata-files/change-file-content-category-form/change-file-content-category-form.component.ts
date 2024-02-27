import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeFileContentCategoryParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-change-file-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-content-category-form.component.html',
})
export class ChangeFileContentCategoryFormComponent { 

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  contentCategories = Object.keys(ContentCategories);

  public changeFileContentCategoryForm: FormGroup = this.fb.group({
    filesContentCategoryFrom: ['', [ Validators.required ]],
    filesContentCategoryTo: ['', [ Validators.required ]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['filesContentCategoryFrom'].value;
    const to = formGroup.controls['filesContentCategoryTo'].value;
    if (formGroup.controls['filesContentCategoryTo'].dirty) {
      if (from === to) {
        formGroup.controls['filesContentCategoryTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('filesContentCategoryTo')?.setErrors(null);
    return null;
  } 

  get changeFileContentCategoryParams(): ChangeFileContentCategoryParams {
    const actionParams: ChangeFileContentCategoryParams = {
      filesContentCategoryFrom: this.changeFileContentCategoryForm.controls['filesContentCategoryFrom'].value,
      filesContentCategoryTo: this.changeFileContentCategoryForm.controls['filesContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileContentCategoryForm.invalid) {
      this.changeFileContentCategoryForm.markAllAsTouched();
      return;
    }

    this.bs.changeFileContentCategory(this.changeFileContentCategoryParams).subscribe( actionResponse => console.log(actionResponse));
  }
}

// TO-DO
export enum ContentCategories {
  "code" = "Code",
  "publisher-version" = "Publisher version",
  "supplementary-material" = "Supplementary material",
  "correspondence" = "Correspondence",
  "copyright-transfer-agreement" = "Copyright transfer agreement",
  "abstract" = "Abstract",
  "post-print" = "Postprint",
  "research-data" = "Research data",
  "multimedia" = "Multimedia",
  "pre-print" = "Preprint",
  "any-fulltext" = "Any fulltext",
  "table-of-contents" = "Table of contents"
}
