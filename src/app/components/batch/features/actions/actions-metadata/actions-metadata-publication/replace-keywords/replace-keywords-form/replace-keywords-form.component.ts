import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ReplaceKeywordsParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-replace-keywords-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './replace-keywords-form.component.html',
})
export class ReplaceKeywordsFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  valSvc = inject(BatchValidatorsService);
  elRef: ElementRef = inject(ElementRef);

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

  ngOnInit(): void {
    this.replaceKeywordsForm.reset();
  } 
  
  onSubmit(): void {
    if (this.replaceKeywordsForm.valid) {
      this.batchSvc.replaceKeywords(this.replaceKeywordsParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.replaceKeywordsForm.valid) {
      Object.keys(this.replaceKeywordsForm.controls).forEach(key => {
        const field = this.replaceKeywordsForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  // TODO: This is a workaround to reset the form when clicking outside the form area
  //       A better approach would be to implement a more robust click outside detection mechanism
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.replaceKeywordsForm.reset();
    }
  }

}
