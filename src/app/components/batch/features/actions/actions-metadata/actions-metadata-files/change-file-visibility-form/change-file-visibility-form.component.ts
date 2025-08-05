import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeFileVisibilityParams } from 'src/app/components/batch/interfaces/batch-params';
import { Visibility } from 'src/app/model/inge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'pure-change-file-visibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-file-visibility-form.component.html',
})
export class ChangeFileVisibilityFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);
  elRef: ElementRef = inject(ElementRef);

  visibility = Object.keys(Visibility);

  public changeFileVisibilityForm: FormGroup = this.fb.group({
    fileVisibilityFrom: [null, [Validators.required]],
    fileVisibilityTo: [null, [Validators.required]],
  },
    { validators: [this.valSvc.notEqualsValidator('fileVisibilityFrom', 'fileVisibilityTo')] });

  get changeFileVisibilityParams(): ChangeFileVisibilityParams {
    const actionParams: ChangeFileVisibilityParams = {
      fileVisibilityFrom: this.changeFileVisibilityForm.controls['fileVisibilityFrom'].value,
      fileVisibilityTo: this.changeFileVisibilityForm.controls['fileVisibilityTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileVisibilityForm.valid) {
      this.batchSvc.changeFileVisibility(this.changeFileVisibilityParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.changeFileVisibilityForm.reset();
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeFileVisibilityForm.valid) {
      Object.keys(this.changeFileVisibilityForm.controls).forEach(key => {
        const field = this.changeFileVisibilityForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.changeFileVisibilityForm.reset();
    }
  }
}
