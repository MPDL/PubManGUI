import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/batch-params';
import { ReviewMethod } from 'src/app/model/inge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-review-method-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-review-method-form.component.html',
})
export class ChangeReviewMethodFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);

  reviewMethods = Object.keys(ReviewMethod);

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: [this.translateSvc.instant(_('batch.actions.metadata.publication.reviewType')), [Validators.required]],
    reviewMethodTo: [this.translateSvc.instant(_('batch.actions.metadata.publication.reviewType')), [Validators.required]],
  },
    { validators: [this.valSvc.notEqualsValidator('reviewMethodFrom', 'reviewMethodTo'), this.valSvc.allRequiredValidator()] });

  get changeReviewMethodParams(): ChangeReviewMethodParams {
    const actionParams: ChangeReviewMethodParams = {
      reviewMethodFrom: this.changeReviewMethodForm.controls['reviewMethodFrom'].value,
      reviewMethodTo: this.changeReviewMethodForm.controls['reviewMethodTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeReviewMethodForm.invalid) {
      this.changeReviewMethodForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeReviewMethod(this.changeReviewMethodParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
