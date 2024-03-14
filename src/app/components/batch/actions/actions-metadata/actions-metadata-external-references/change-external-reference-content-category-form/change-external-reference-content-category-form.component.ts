import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
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
  
  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  public changeExternalReferenceContentCategoryForm: FormGroup = this.fb.group({
    externalReferenceContentCategoryFrom: ['', [ Validators.required ]],
    externalReferenceContentCategoryTo: ['', [ Validators.required ]],
  }, 
  { validators: this.vs.notEqualsValidator('externalReferenceContentCategoryFrom','externalReferenceContentCategoryTo') });

  get changeExternalReferenceContentCategoryParams(): ChangeExternalReferenceContentCategoryParams {
    const actionParams: ChangeExternalReferenceContentCategoryParams = {
      externalReferenceContentCategoryFrom: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryFrom'].value,
      externalReferenceContentCategoryTo: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryTo'].value,
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
