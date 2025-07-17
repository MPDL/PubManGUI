import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeLocalTagParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-local-tags-form.component.html',
})
export class ChangeLocalTagsFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);

  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: ['', [Validators.required]],
    localTagTo: ['', [Validators.required]],
  },
    { validators: [
        this.valSvc.notEqualsValidator('localTagFrom', 'localTagTo'),
        this.valSvc.allRequiredValidator()
      ]});


  get changeLocalTagsParams(): ChangeLocalTagParams {
    const actionParams: ChangeLocalTagParams = {
      localTagFrom: this.changeLocalTagsForm.controls['localTagFrom'].value,
      localTagTo: this.changeLocalTagsForm.controls['localTagTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeLocalTagsForm.invalid) {
      this.changeLocalTagsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.changeLocalTags(this.changeLocalTagsParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }

}
