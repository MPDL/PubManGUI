import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { BatchValidatorsService } from 'src/app/components/batch/services/batch-validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { IpEntry, MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import type { ReplaceFileAudienceParams } from 'src/app/components/batch/interfaces/batch-params';

import {
  AudienceFormComponent
} from 'src/app/components/batch/features/actions/actions-metadata/actions-metadata-files/replace-file-audience-form/audience-form/audience-form.component'
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-replace-file-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AudienceFormComponent,
    TranslatePipe
  ],
  templateUrl: './replace-file-audience-form.component.html',
})
export class ReplaceFileAudienceFormComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  valSvc = inject(BatchValidatorsService);
  batchSvc = inject(BatchService);
  miscSvc = inject(MiscellaneousService);

  index!: number;
  index_length!: number;

  ous: IpEntry[] = [];

  ngOnInit(): void {
    this.miscSvc.retrieveIpList()
      .subscribe( ous => {
        this.ous = ous.sort((a,b) => a.name.localeCompare(b.name));
      })
  }

  public replaceFileAudienceForm: FormGroup = this.fb.group({
    allowedAudienceIds: this.fb.array([{
      name: '',
      id: '',
      ipRanges: []
    }])
  },
  {
    //validators: this.valSvc.noDuplicatesValidator(this.allowedAudienceIds)
  });


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
    this.allowedAudienceIds.insert(index + 1, this.fb.control('Range'));
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
    if (this.replaceFileAudienceForm.invalid || this.allowedAudienceIds.length <= 1) {
      this.replaceFileAudienceForm.markAllAsTouched();
      return;
    }

    this.batchSvc.replaceFileAudience(this.replaceFileAudienceParams).subscribe( actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      // ( this.replaceFileAudienceForm.controls['allowedAudienceIds'] as FormArray ) = this.fb.array([]);
      //this.replaceFileAudienceForm.reset();
      this.router.navigate(['/batch/logs']);
    } );
  }

}
