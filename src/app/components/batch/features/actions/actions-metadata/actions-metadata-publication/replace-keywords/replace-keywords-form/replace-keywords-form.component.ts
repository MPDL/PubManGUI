import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ReplaceKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-replace-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './replace-keywords-form.component.html',
})
export class ReplaceKeywordsFormComponent {
    router = inject(Router);
    fb = inject(FormBuilder);
    batchSvc = inject(BatchService);

  public replaceKeywordsForm: FormGroup = this.fb.group({
    keywords: ['', [Validators.required]],
  });

  get replaceKeywordsParams(): ReplaceKeywordsParams {
    const actionParams: ReplaceKeywordsParams = {
      keywords: this.replaceKeywordsForm.controls['keywords'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceKeywordsForm.invalid) {
      this.replaceKeywordsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.replaceKeywords(this.replaceKeywordsParams).subscribe(actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.router.navigate(['/batch/logs']);
    });
  }

}
