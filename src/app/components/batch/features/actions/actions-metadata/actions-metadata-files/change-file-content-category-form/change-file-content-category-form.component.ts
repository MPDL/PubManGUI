import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeFileContentCategoryParams } from 'src/app/components/batch/interfaces/batch-params';
import { ContentCategories } from 'src/app/model/inge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-change-file-content-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-file-content-category-form.component.html',
})
export class ChangeFileContentCategoryFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);
  elRef: ElementRef = inject(ElementRef);

  contentCategories = Object.keys(ContentCategories).sort();

  public changeFileContentCategoryForm: FormGroup = this.fb.group({
    fileContentCategoryFrom: [null, [Validators.required]],
    fileContentCategoryTo: [null, [Validators.required]],
  },
    { validators: [this.valSvc.notSameValues('fileContentCategoryFrom', 'fileContentCategoryTo')] });

  get changeFileContentCategoryParams(): ChangeFileContentCategoryParams {
    const actionParams: ChangeFileContentCategoryParams = {
      fileContentCategoryFrom: this.changeFileContentCategoryForm.controls['fileContentCategoryFrom'].value,
      fileContentCategoryTo: this.changeFileContentCategoryForm.controls['fileContentCategoryTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.changeFileContentCategoryForm.reset();
  }

  onSubmit(): void {
    if (this.changeFileContentCategoryForm.invalid) {
      this.changeFileContentCategoryForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeFileContentCategory(this.changeFileContentCategoryParams).subscribe(actionResponse => {
      //console.log(actionResponse);
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.changeFileContentCategoryForm.reset();
      this.router.navigate(['/batch/logs']);
    });
  }

  checkIfAllRequired() {
    if (!this.changeFileContentCategoryForm.valid) {
      Object.keys(this.changeFileContentCategoryForm.controls).forEach(key => {
        const field = this.changeFileContentCategoryForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.changeFileContentCategoryForm.reset();
    }
  }
}
