import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { SourceIdType } from 'src/app/model/inge';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeSourceIdentifierParams } from 'src/app/components/batch/interfaces/batch-params';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";


@Component({
  selector: 'pure-change-source-identifier-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-source-identifier-form.component.html',
})
export class ChangeSourceIdentifierFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  translateSvc = inject(TranslateService);
  elRef: ElementRef = inject(ElementRef);

  sourceIdTypes = Object.keys(SourceIdType);

  public changeSourceIdentifierForm: FormGroup = this.fb.group({
    sourceNumber: ['1', Validators.required],
    sourceIdentifierType: [null, Validators.required],
    sourceIdentifierFrom: ['', [Validators.required, Validators.minLength(1)]],
    sourceIdentifierTo: [''],
  },
    {
      validators: [this.valSvc.notSameValues('sourceIdentifierFrom', 'sourceIdentifierTo')]
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

  ngOnInit(): void {
    this.changeSourceIdentifierForm.reset();
    this.changeSourceIdentifierForm.controls['sourceNumber'].setValue('1');
  }

  onSubmit(): void {
    if (this.changeSourceIdentifierForm.valid) {
      this.batchSvc.changeSourceIdentifier(this.changeSourceIdentifierParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.changeSourceIdentifierForm.valid) {
      Object.keys(this.changeSourceIdentifierForm.controls).forEach(key => {
        const field = this.changeSourceIdentifierForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.changeSourceIdentifierForm.reset();
      this.changeSourceIdentifierForm.controls['sourceNumber'].setValue('1');
    }
  }
}
