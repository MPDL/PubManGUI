import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { AddKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-add-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './add-keywords-form.component.html',
})
export class AddKeywordsFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  batchSvc = inject(BatchService);

  public addKeywordsForm: FormGroup = this.fb.group({
    keywords: ['', [Validators.required]],
  });

  get addKeywordsParams(): AddKeywordsParams {
    const actionParams: AddKeywordsParams = {
      keywords: this.addKeywordsForm.controls['keywords'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.addKeywordsForm.invalid) {
      this.addKeywordsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.addKeywords(this.addKeywordsParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }

  // TO-DO? No duplicated keywords validation.
}
