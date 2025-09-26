import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { ChangeLocalTagParams } from 'src/app/components/batch/interfaces/batch-params';

import { TranslatePipe } from "@ngx-translate/core";

import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-change-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './change-local-tags-form.component.html',
})
export class ChangeLocalTagsFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  elRef: ElementRef = inject(ElementRef);

  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: [null, [Validators.required]],
    localTagTo: [null, [Validators.required]],
  }, {
      validators: [
        this.valSvc.notSameValues('localTagFrom', 'localTagTo')
      ]
  });


  get changeLocalTagsParams(): ChangeLocalTagParams {
    const actionParams: ChangeLocalTagParams = {
      localTagFrom: this.changeLocalTagsForm.controls['localTagFrom'].value,
      localTagTo: this.changeLocalTagsForm.controls['localTagTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.changeLocalTagsForm.reset();
  } 
  
  onSubmit(): void {
    if (this.changeLocalTagsForm.valid) {
      this.batchSvc.changeLocalTags(this.changeLocalTagsParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    if(this.changeLocalTagsForm.invalid) {
      Object.keys(this.changeLocalTagsForm.controls).forEach(key => {
        const field = this.changeLocalTagsForm.get(key);
      if (field!.hasValidator(Validators.required) && (field!.pristine)) {
          field!.markAsPending();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.changeLocalTagsForm.reset();
    }
  }

}
