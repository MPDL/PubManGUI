import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';


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

  constructor(private fb: FormBuilder) { }

  contentCategories = Object.keys(ContentCategories);

  // changeFileContentCategory(List<String> itemIds, String filesContentCategoryFrom, String filesContentCategoryTo, String userId, String token);
  public changeFileContentCategoryForm: FormGroup = this.fb.group({
    contentFileCategoryFrom: ['', [ Validators.required ]],
    contentFileCategoryTo: ['', [ Validators.required ]],
  });


  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${errors['minlength'].requiredLength} characters required!`;
      }
    }

    return null;
  }

  onSubmit(): void {
    if (this.changeFileContentCategoryForm.invalid) {
      this.changeFileContentCategoryForm.markAllAsTouched();
      return;
    }

    console.log(this.changeFileContentCategoryForm.value);
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
