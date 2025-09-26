import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { AddKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-add-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './add-keywords-form.component.html',
})
export class AddKeywordsFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  elRef: ElementRef = inject(ElementRef);

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

  ngOnInit(): void {
    this.addKeywordsForm.reset();
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

  checkIfAllRequired() {
    if (!this.addKeywordsForm.valid || this.addKeywordsForm.controls['keywords'].pristine) {
      this.addKeywordsForm.controls['keywords'].markAsPending();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.addKeywordsForm.reset();
    }
  }
  // TO-DO? No duplicated keywords validation.
}
