import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { Visibility } from 'src/app/model/inge';

import { BatchService } from 'src/app/components/batch/services/batch.service';
import { ChangeFileVisibilityParams } from 'src/app/components/batch/interfaces/actions-params';


@Component({
  selector: 'pure-change-file-visibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-file-visibility-form.component.html',
})
export class ChangeFileVisibilityFormComponent {

  constructor(private fb: FormBuilder, private bs: BatchService) { }

  visibilityTypes = Object.keys(Visibility);

  public changeFileVisibilityForm: FormGroup = this.fb.group({
    filesVisibilityFrom: ['', [Validators.required]],
    filesVisibilityTo: ['', [Validators.required]],
  }, { validators: this.fieldsNotEqual.bind(this) });

  fieldsNotEqual(formGroup: FormGroup) {
    const from = formGroup.controls['filesVisibilityFrom'].value;
    const to = formGroup.controls['filesVisibilityTo'].value;
    if (formGroup.controls['filesVisibilityTo'].dirty) {
      if (from === to) {
        formGroup.controls['filesVisibilityTo'].setErrors({'fieldsMatch': true});
        return { fieldsMatch: true }
      };
    }
    formGroup.get('filesVisibilityTo')?.setErrors(null);
    return null;
}

  get changeFileVisibilityParams(): ChangeFileVisibilityParams {
    const actionParams: ChangeFileVisibilityParams = {
      filesVisibilityFrom: this.changeFileVisibilityForm.controls['filesVisibilityFrom'].value,
      filesVisibilityTo: this.changeFileVisibilityForm.controls['filesVisibilityTo'].value,
      itemIds: []
    }
    return actionParams;
  }

  onSubmit(): void {
    if (this.changeFileVisibilityForm.invalid) {
      this.changeFileVisibilityForm.markAllAsTouched();
      return;
    }

    this.bs.changeFileVisibility(this.changeFileVisibilityParams).subscribe( actionResponse => console.log(actionResponse));
  }
}
