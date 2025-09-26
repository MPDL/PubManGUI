import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeReviewMethodParams } from 'src/app/components/batch/interfaces/batch-params';
import { ReviewMethod } from 'src/app/model/inge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-change-review-method-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-review-method-form.component.html',
})
export class ChangeReviewMethodFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);
  elRef: ElementRef = inject(ElementRef);

  reviewMethods = Object.keys(ReviewMethod);

  public changeReviewMethodForm: FormGroup = this.fb.group({
    reviewMethodFrom: [null, [Validators.required]],
    reviewMethodTo: [null, [Validators.required]],
  },
    { validators: [this.valSvc.notSameValues('reviewMethodFrom', 'reviewMethodTo')] });

  get changeReviewMethodParams(): ChangeReviewMethodParams {
    const actionParams: ChangeReviewMethodParams = {
      reviewMethodFrom: this.changeReviewMethodForm.controls['reviewMethodFrom'].value,
      reviewMethodTo: this.changeReviewMethodForm.controls['reviewMethodTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.changeReviewMethodForm.reset();
  } 
  
  onSubmit(): void {
    if (this.changeReviewMethodForm.valid) {

      this.batchSvc.changeReviewMethod(this.changeReviewMethodParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeReviewMethodForm.valid) {
      Object.keys(this.changeReviewMethodForm.controls).forEach(key => {
        const field = this.changeReviewMethodForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.changeReviewMethodForm.reset();
    }
  }
}
