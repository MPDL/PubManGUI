import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SourceIdType } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { AddSourceIdentiferParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from '@ngx-translate/core';


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
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);

  sourceIdTypes = Object.keys(SourceIdType);

  public addSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1'],
    sourceIdentifierType: [this.translateSvc.instant(_('batch.actions.metadata.source.addId.default')), Validators.required],
    sourceIdentifier: ['', [Validators.required, Validators.minLength(1)]]
  }, { 
    validators: this.valSvc.allRequiredValidator() 
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
    if (this.addSourceIdentifierForm.invalid) {
      this.addSourceIdentifierForm.markAllAsTouched();
      return;
    }

    this.batchSvc.addSourceIdentifer(this.addSourceIdentifierParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}