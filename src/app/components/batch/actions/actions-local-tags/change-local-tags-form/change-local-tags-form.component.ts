import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ValidatorsService } from 'src/app/components/batch/services/validators.service';
import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeLocalTagParams } from 'src/app/components/batch/interfaces/actions-params';

@Component({
  selector: 'pure-change-local-tags-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-local-tags-form.component.html',
})
export class ChangeLocalTagsFormComponent {

  constructor(private fb: FormBuilder, public vs: ValidatorsService, private bs: BatchService) { }

  public changeLocalTagsForm: FormGroup = this.fb.group({
    localTagFrom: ['', [Validators.required, this.vs.singleWordValidator()]],
    localTagTo: ['', [Validators.required, this.vs.singleWordValidator()]],
  },
    {
      validators: this.vs.notEqualsValidator('localTagFrom', 'localTagTo')
    });


  get changeLocalTagsParams(): ChangeLocalTagParams {
    const actionParams: ChangeLocalTagParams = {
      localTagFrom: this.changeLocalTagsForm.controls['localTagFrom'].value,
      localTagTo: this.changeLocalTagsForm.controls['localTagTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeLocalTagsForm.invalid) {
      this.changeLocalTagsForm.markAllAsTouched();
      return;
    }

    this.bs.changeLocalTags(this.changeLocalTagsParams).subscribe(actionResponse => console.log(actionResponse));
    this.changeLocalTagsForm.reset();
  }

}