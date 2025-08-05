import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import type { ReplaceSourceEditionParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-replace-source-edition-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './replace-source-edition-form.component.html',
})
export class ReplaceSourceEditionFormComponent {
  router = inject(Router);
  fb = inject(FormBuilder);
  batchSvc = inject(BatchService);
  valSvc = inject(BatchValidatorsService);
  elRef: ElementRef = inject(ElementRef);

  public replaceSourceEditionForm: FormGroup = this.fb.group({
    sourceNumber: ['1', [Validators.required]],
    sourceEdition: ['', [Validators.required]],
  });

  get replaceSourceEditionParams(): ReplaceSourceEditionParams {
    const actionParams: ReplaceSourceEditionParams = {
      sourceNumber: this.replaceSourceEditionForm.controls['sourceNumber'].value,
      edition: this.replaceSourceEditionForm.controls['sourceEdition'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.replaceSourceEditionForm.valid) {
      this.batchSvc.replaceSourceEdition(this.replaceSourceEditionParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if (!this.replaceSourceEditionForm.valid) {
      Object.keys(this.replaceSourceEditionForm.controls).forEach(key => {
        const field = this.replaceSourceEditionForm.get(key);
        if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.replaceSourceEditionForm.reset();
      this.replaceSourceEditionForm.controls['sourceNumber'].setValue('1');
    }
  }
}
