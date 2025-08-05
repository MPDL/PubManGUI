import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SourceIdType } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import type { AddSourceIdentiferParams } from 'src/app/components/batch/interfaces/batch-params';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'pure-add-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './add-source-identifier-form.component.html',
})
export class AddSourceIdentifierFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  valSvc = inject(BatchValidatorsService);
  translateSvc = inject(TranslateService);
  elRef: ElementRef = inject(ElementRef);

  sourceIdTypes = Object.keys(SourceIdType);

  public addSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1'],
    sourceIdentifierType: [null, Validators.required],
    sourceIdentifier: [null, [Validators.required, Validators.minLength(1)]]
  });

  get addSourceIdentifierParams(): AddSourceIdentiferParams {
    const actionParams: AddSourceIdentiferParams = {
      sourceNumber: this.addSourceIdentifierForm.controls['sourceNumber'].value,
      sourceIdentifierType: this.addSourceIdentifierForm.controls['sourceIdentifierType'].value,
      sourceIdentifier: this.addSourceIdentifierForm.controls['sourceIdentifier'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.addSourceIdentifierForm.valid) {
      this.batchSvc.addSourceIdentifer(this.addSourceIdentifierParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.addSourceIdentifierForm.valid) {
      Object.keys(this.addSourceIdentifierForm.controls).forEach(key => {
        const field = this.addSourceIdentifierForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.addSourceIdentifierForm.reset();
      this.addSourceIdentifierForm.controls['sourceNumber'].setValue('1');
    }
  }
}
