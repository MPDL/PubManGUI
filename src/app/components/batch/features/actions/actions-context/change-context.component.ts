import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ContextDbRO } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeContextParams } from 'src/app/components/batch/interfaces/batch-params';
import { AaService } from 'src/app/services/aa.service';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-batch-change-context',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-context.component.html',
})
export class ActionsContextComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  aaSvc = inject(AaService);
  translateSvc = inject(TranslateService);

  user_contexts?: ContextDbRO[] = [];

  ngOnInit(): void {
    this.aaSvc.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    );
  }

  public changeContextForm: FormGroup = this.fb.group({
    contextFrom: [null, Validators.required],
    contextTo: [null, Validators.required]
  },
    { validators: [this.valSvc.notEqualsValidator('contextFrom', 'contextTo')] }
  );

  get changeContextParams(): ChangeContextParams {
    const actionParams: ChangeContextParams = {
      contextFrom: this.changeContextForm.controls['contextFrom'].value,
      contextTo: this.changeContextForm.controls['contextTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeContextForm.valid) {
      this.batchSvc.changeContext(this.changeContextParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeContextForm.valid) {
      Object.keys(this.changeContextForm.controls).forEach(key => {
        const field = this.changeContextForm.get(key);
        if (field!.hasValidator(Validators.required) && (!field!.dirty)) {
          field!.markAsPending();
        }
      });
    }
  }

}
