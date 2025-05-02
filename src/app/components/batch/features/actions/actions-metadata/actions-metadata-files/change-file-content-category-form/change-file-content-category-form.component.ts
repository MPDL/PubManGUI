import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeFileContentCategoryParams } from 'src/app/components/batch/interfaces/batch-params';
import { ContentCategories } from 'src/app/model/inge';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-file-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-file-content-category-form.component.html',
})
export class ChangeFileContentCategoryFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);

  contentCategories = Object.keys(ContentCategories).sort();

  public changeFileContentCategoryForm: FormGroup = this.fb.group({
    fileContentCategoryFrom: [this.translateSvc.instant(_('batch.actions.metadata.files.contentCategory')), [Validators.required]],
    fileContentCategoryTo: [this.translateSvc.instant(_('batch.actions.metadata.files.contentCategory')), [Validators.required]],
  },
    { validators: [this.valSvc.notEqualsValidator('fileContentCategoryFrom', 'fileContentCategoryTo'), this.valSvc.allRequiredValidator()] });

  get changeFileContentCategoryParams(): ChangeFileContentCategoryParams {
    const actionParams: ChangeFileContentCategoryParams = {
      fileContentCategoryFrom: this.changeFileContentCategoryForm.controls['fileContentCategoryFrom'].value,
      fileContentCategoryTo: this.changeFileContentCategoryForm.controls['fileContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileContentCategoryForm.invalid) {
      this.changeFileContentCategoryForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeFileContentCategory(this.changeFileContentCategoryParams).subscribe(actionResponse => {
      //console.log(actionResponse); 
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
