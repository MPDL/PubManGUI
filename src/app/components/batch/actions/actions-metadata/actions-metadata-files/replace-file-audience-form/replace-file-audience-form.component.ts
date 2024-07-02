import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ReplaceFileAudienceParams } from 'src/app/components/batch/interfaces/actions-params';
import { ipList } from 'src/app/components/batch/interfaces/actions-responses';

import { AudienceFormComponent } from 'src/app/components/batch/actions/actions-metadata/actions-metadata-files/replace-file-audience-form/audience-form/audience-form.component'
import { AddRemoveButtonsComponent } from 'src/app/shared/components/add-remove-buttons/add-remove-buttons.component';


@Component({
  selector: 'pure-replace-file-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AudienceFormComponent,
    AddRemoveButtonsComponent
  ],
  templateUrl: './replace-file-audience-form.component.html',
})
export class ReplaceFileAudienceFormComponent implements OnInit {

  index!: number;
  index_length!: number;

  ous: ipList[] = [];

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService,
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

  ngOnInit(): void {
    this.batchSvc.getIpList()
      .subscribe( ous => {
        this.ous = ous.sort((a,b) => a.name.localeCompare(b.name) );
      })
  }

  public replaceFileAudienceForm: FormGroup = this.fb.group({
    allowedAudienceIds: this.fb.array([])
  },
  {
    //validators: this.validSvc.noDuplicatesValidator(this.allowedAudienceIds)
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
    this.allowedAudienceIds.insert(index + 1, this.fb.control(''));
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
    if (this.replaceFileAudienceForm.invalid) {
      this.replaceFileAudienceForm.markAllAsTouched();
      return;
    }

    if (this.allowedAudienceIds.length === 0) return

    this.batchSvc.replaceFileAudience(this.replaceFileAudienceParams).subscribe( actionResponse => {
      this.batchSvc.startProcess(actionResponse.batchLogHeaderId);
      this.msgSvc.info(`Action started!\n`);
      ( this.replaceFileAudienceForm.controls['allowedAudienceIds'] as FormArray ) = this.fb.array([]);
      this.replaceFileAudienceForm.reset();
    } );

  }

}