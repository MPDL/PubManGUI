import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { AddLocalTagsParams } from 'src/app/components/batch/interfaces/actions-params';
import { MessageService } from 'src/app/shared/services/message.service';

import { ControlType } from 'src/app/components/item-edit/services/form-builder.service';
import { ChipsComponent } from 'src/app/shared/components/chips/chips.component';

@Component({
  selector: 'pure-add-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChipsComponent
  ],
  templateUrl: './add-local-tags-form.component.html',
})
export class AddLocalTagsFormComponent {

  constructor(
    private fb: FormBuilder, 
    public validSvc: ValidatorsService, 
    private batchSvc: BatchService,
    private msgSvc: MessageService) { }

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

  onSubmit(): void {
    if (this.addLocalTagsForm.invalid) {
      this.addLocalTagsForm.markAllAsTouched();
      return;
    }

    this.batchSvc.addLocalTags(this.addLocalTagsParams).subscribe( actionResponse => {
      //console.log(actionResponse); 
      this.msgSvc.info(`Action started!\n`);
      this.addLocalTagsForm.reset();
      ( this.addLocalTagsForm.controls['localTags'] as FormArray ) = this.fb.array([]);
    });

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


}