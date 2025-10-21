import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { IpEntry, MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import type { ReplaceFileAudienceParams } from 'src/app/components/batch/interfaces/batch-params';

import {
  AudienceFormComponent
} from 'src/app/components/batch/features/actions/actions-metadata/actions-metadata-files/replace-file-audience-form/audience-form/audience-form.component'
import { TranslatePipe } from "@ngx-translate/core";
import { ValidationErrorComponent } from "src/app/components/shared/validation-error/validation-error.component";

@Component({
  selector: 'pure-replace-file-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AudienceFormComponent,
    TranslatePipe,
    ValidationErrorComponent
  ],
  templateUrl: './replace-file-audience-form.component.html',
})
export class ReplaceFileAudienceFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  miscSvc = inject(MiscellaneousService);
  elRef: ElementRef = inject(ElementRef);

  index!: number;
  index_length!: number;

  ous: IpEntry[] = [];

  ngOnInit(): void {
    this.miscSvc.retrieveIpList()
      .subscribe(ous => {
        this.ous = ous.sort((a, b) => a.name.localeCompare(b.name));
      })
      this.replaceFileAudienceForm.reset();
  }

  public replaceFileAudienceForm: FormGroup = this.fb.group({
    allowedAudienceIds: this.fb.array([{
      name: [null],
      id: [null],
      ipRanges: []
    }]
    )
  }, { validators: [this.valSvc.noDuplicatesInArray()] });

  get allowedAudienceIds() {
    return this.replaceFileAudienceForm.get('allowedAudienceIds') as FormArray<FormControl>;
  }

  get replaceFileAudienceParams(): ReplaceFileAudienceParams {
    const actionParams: ReplaceFileAudienceParams = {
      allowedAudienceIds: this.getIDsOfAudience(),
      itemIds: []
    }

    return actionParams;
  }

  handleAudienceNotification(event: any) {
    if (event.action === 'add') {
      this.addAudience(event.index);
    } else if (event.action === 'remove') {
      this.removeAudience(event.index);
    }
  }

  addAudience(index: number) {
    this.allowedAudienceIds.insert(index + 1, this.fb.control(null));
  }

  removeAudience(index: number) {
    this.allowedAudienceIds.removeAt(index);
  }

  getIDsOfAudience(): string[] {
    let Audiences = [];

    for (let range of this.allowedAudienceIds.controls) {
      Audiences.push(this.ous.find(x => x.name === range.value)!.id);
    }

    return Audiences;
  }

  onSubmit(): void {
    if (this.replaceFileAudienceForm.valid && this.allowedAudienceIds.valid) {
      this.batchSvc.replaceFileAudience(this.replaceFileAudienceParams).subscribe(actionResponse => {
        this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
        this.allowedAudienceIds.clear();
        this.replaceFileAudienceForm.reset();
        this.router.navigate(['/batch/logs']);
      });
    }
  }

  checkIfAllRequired() {
    this.replaceFileAudienceForm.updateValueAndValidity();
    
    if (this.replaceFileAudienceForm.get('allowedAudienceIds')?.value.length === 1 && this.replaceFileAudienceForm.get('allowedAudienceIds')?.invalid) {
      this.replaceFileAudienceForm.get('allowedAudienceIds')?.markAsPending();
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.elRef.nativeElement.parentElement.contains(event.target) && !this.elRef.nativeElement.contains(event.target)) {
      this.allowedAudienceIds.clear();
      this.allowedAudienceIds.push(this.fb.control('null'));
      this.replaceFileAudienceForm.reset();
    }
  }
}
