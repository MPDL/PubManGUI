import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { AddLocalTagsParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-add-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-local-tags-form.component.html',
})
export class AddLocalTagsFormComponent {

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  public addLocalTagsForm: FormGroup = this.fb.group({
    localTags: this.fb.array([])
  });

  public localTag: FormControl = new FormControl('', [Validators.required, Validators.minLength(1), this.vs.singleWordValidator(), this.vs.notBeOnValidator( this.addLocalTagsForm.controls['localTags'] )]);

  get tagsToAdd() {
    return this.addLocalTagsForm.get('localTags') as FormArray;
  }

  get addLocalTagsParams(): AddLocalTagsParams {
    const actionParams: AddLocalTagsParams = {
      localTags: this.addLocalTagsForm.controls['localTags'].value,
      itemIds: []
    }
    return actionParams;
  }

  onAddToNewTags(): void {
    if (this.localTag.invalid) return;

    this.tagsToAdd.push(
      this.fb.control(this.localTag.value, Validators.required)
    );

    this.localTag.reset();
  }

  onDeleteTag(index: number): void {
    this.tagsToAdd.removeAt(index);
  }

  onSubmit(): void {
    if (this.addLocalTagsForm.invalid) {
      this.addLocalTagsForm.markAllAsTouched();
      return;
    }

    this.bs.addLocalTags(this.addLocalTagsParams).subscribe( actionResponse => console.log(actionResponse));
    this.addLocalTagsForm.reset();
  }

}
