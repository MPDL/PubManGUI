import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeExternalReferenceContentCategoryParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-change-external-reference-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-external-reference-content-category-form.component.html',
})
export class ChangeExternalReferenceContentCategoryFormComponent {

  contentCategories = Object.keys(ContentCategories);
  
  constructor(private fb: FormBuilder, private bs: BatchService) { }

  public changeExternalReferenceContentCategoryForm: FormGroup = this.fb.group({
    externalReferencesContentCategoryFrom: ['', [ Validators.required ]],
    externalReferencesContentCategoryTo: ['', [ Validators.required ]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['externalReferencesContentCategoryFrom'].value;
    const to = formGroup.controls['externalReferencesContentCategoryTo'].value;
    if (formGroup.controls['externalReferencesContentCategoryTo'].dirty) {
      if (from === to) {
        formGroup.controls['externalReferencesContentCategoryTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('externalReferencesContentCategoryTo')?.setErrors(null);
    return null;
  } 

  get changeExternalReferenceContentCategoryParams(): ChangeExternalReferenceContentCategoryParams {
    const actionParams: ChangeExternalReferenceContentCategoryParams = {
      externalReferencesContentCategoryFrom: this.changeExternalReferenceContentCategoryForm.controls['externalReferencesContentCategoryFrom'].value,
      externalReferencesContentCategoryTo: this.changeExternalReferenceContentCategoryForm.controls['externalReferencesContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeExternalReferenceContentCategoryForm.invalid) {
      this.changeExternalReferenceContentCategoryForm.markAllAsTouched();
      return;
    }

    this.bs.changeExternalReferenceContentCategory(this.changeExternalReferenceContentCategoryParams).subscribe( actionResponse => console.log(actionResponse));
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
