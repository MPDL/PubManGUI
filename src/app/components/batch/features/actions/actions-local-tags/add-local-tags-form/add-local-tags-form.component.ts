import { CommonModule } from '@angular/common';
import { Component, inject, ElementRef, HostListener } from '@angular/core';

import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import type { AddLocalTagsParams } from 'src/app/components/batch/interfaces/batch-params';

import { ChipsComponent } from 'src/app/components/shared/chips/chips.component';

import { TranslatePipe } from "@ngx-translate/core";

import { ControlType } from 'src/app/services/form-builder.service';

@Component({
  selector: 'pure-add-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChipsComponent,
    TranslatePipe
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
    localTags: this.fb.array([])
  });

  get tagsToAdd() {
    return this.addLocalTagsForm.get('localTags') as FormArray<FormControl<ControlType<string>>>
  }

  get addLocalTagsParams(): AddLocalTagsParams {
    const actionParams: AddLocalTagsParams = {
      localTags: this.addLocalTagsForm.controls['localTags'].value,
      itemIds: []
    }
    return actionParams;
  }

  ngOnInit(): void {
    this.addLocalTagsForm.reset();
  }

  onSubmit(): void {
    if (this.addLocalTagsForm.valid) {
      this.batchSvc.addLocalTags(this.addLocalTagsParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  get localTags() {
    return this.addLocalTagsForm.get('localTags') as FormArray<FormControl<ControlType<string>>>
  }

  add_remove_local_tag(event: any) {
    console.log("onEvent");
    if (event.action === 'add') {
      this.localTags.insert(event.index + 1, new FormControl());
    } else if (event.action === 'remove') {
      this.localTags.removeAt(event.index);
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.addLocalTagsForm.reset();
    }
  }

}
