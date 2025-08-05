import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeExternalReferenceContentCategoryParams } from 'src/app/components/batch/interfaces/batch-params';
import { ContentCategories } from 'src/app/model/inge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-external-reference-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-external-reference-content-category-form.component.html',
})
export class ChangeExternalReferenceContentCategoryFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);

  contentCategories = Object.keys(ContentCategories).sort();

  public changeExternalReferenceContentCategoryForm: FormGroup = this.fb.group({
    externalReferenceContentCategoryFrom: [null, [ Validators.required ]],
    externalReferenceContentCategoryTo: [null, [ Validators.required ]],
  },
  { validators: [this.valSvc.notEqualsValidator('externalReferenceContentCategoryFrom','externalReferenceContentCategoryTo')] });

  get changeExternalReferenceContentCategoryParams(): ChangeExternalReferenceContentCategoryParams {
    const actionParams: ChangeExternalReferenceContentCategoryParams = {
      externalReferenceContentCategoryFrom: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryFrom'].value,
      externalReferenceContentCategoryTo: this.changeExternalReferenceContentCategoryForm.controls['externalReferenceContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeExternalReferenceContentCategoryForm.valid) {
      this.batchSvc.changeExternalReferenceContentCategory(this.changeExternalReferenceContentCategoryParams).subscribe( actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }


  checkIfAllRequired() {
    if (!this.changeExternalReferenceContentCategoryForm.valid) {
      Object.keys(this.changeExternalReferenceContentCategoryForm.controls).forEach(key => {
        const field = this.changeExternalReferenceContentCategoryForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

 }
