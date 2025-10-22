import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';

import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { AddLocalTagsParams } from 'src/app/components/batch/interfaces/batch-params';

import { ChipsComponent } from 'src/app/components/shared/chips/chips.component';

import { TranslatePipe } from "@ngx-translate/core";

import { ControlType } from 'src/app/services/form-builder.service';
import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";


@Component({
  selector: 'pure-add-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChipsComponent,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './add-local-tags-form.component.html',
})
export class AddLocalTagsFormComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  elRef: ElementRef = inject(ElementRef);

  public addLocalTagsForm: FormGroup = this.fb.group({
    localTags: this.fb.array([], Validators.required)
  });

  get localTags() {
    return this.addLocalTagsForm.get('localTags') as FormArray<FormControl<ControlType<string>>>
  }

  get addLocalTagsParams(): AddLocalTagsParams {
    const actionParams: AddLocalTagsParams = {
      localTags: this.localTags.value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.addLocalTagsForm.reset();
  }

  onSubmit(): void {
    if (this.localTags.value !== null && this.localTags.value.length > 0) {
      console.log("Submitting form with params:", this.addLocalTagsParams);
      this.batchSvc.addLocalTags(this.addLocalTagsParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.addLocalTagsForm.reset();
    }
  }

}
