import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SourceIdType } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeSourceIdentifierParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from '@ngx-translate/core';

@Component({
  selector: 'pure-change-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-source-identifier-form.component.html',
})
export class ChangeSourceIdentifierFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);

  sourceIdTypes = Object.keys(SourceIdType);

  public changeSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1'],
    sourceIdentifierType: [this.translateSvc.instant(_('batch.actions.metadata.source.replaceId.default')), Validators.required],
    sourceIdentifierFrom: ['', [Validators.required, Validators.minLength(1)]],
    sourceIdentifierTo: [''],
  },
    {
      validators: [this.valSvc.notEqualsValidator('sourceIdentifierFrom', 'sourceIdentifierTo'), this.valSvc.allRequiredValidator()]
    });

  get changeSourceIdentifierParams(): ChangeSourceIdentifierParams {
    const actionParams: ChangeSourceIdentifierParams = {
      sourceNumber: this.changeSourceIdentifierForm.controls['sourceNumber'].value,
      sourceIdentifierType: this.changeSourceIdentifierForm.controls['sourceIdentifierType'].value,
      sourceIdentifierFrom: this.changeSourceIdentifierForm.controls['sourceIdentifierFrom'].value,
      sourceIdentifierTo: this.changeSourceIdentifierForm.controls['sourceIdentifierTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeSourceIdentifierForm.invalid) {
      this.changeSourceIdentifierForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeSourceIdentifier(this.changeSourceIdentifierParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }
}
