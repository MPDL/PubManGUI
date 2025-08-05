import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';

import type { ChangeKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-change-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './change-keywords-form.component.html',
})
export class ChangeKeywordsFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  valSvc = inject(BatchValidatorsService);
  elRef: ElementRef = inject(ElementRef);

  public changeKeywordsForm: FormGroup = this.fb.group({
    keywordsFrom: [null, [Validators.required]],
    keywordsTo: [null, [Validators.required]],
  }, {
    validators: this.valSvc.notEqualsValidator('keywordsFrom', 'keywordsTo')
  });

  get changeKeywordsParams(): ChangeKeywordsParams {
    const actionParams: ChangeKeywordsParams = {
      keywordsFrom: this.changeKeywordsForm.controls['keywordsFrom'].value,
      keywordsTo: this.changeKeywordsForm.controls['keywordsTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeKeywordsForm.valid) {
      this.batchSvc.changeKeywords(this.changeKeywordsParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeKeywordsForm.valid) {
      Object.keys(this.changeKeywordsForm.controls).forEach(key => {
        const field = this.changeKeywordsForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.changeKeywordsForm.reset();
    }
  }
}
