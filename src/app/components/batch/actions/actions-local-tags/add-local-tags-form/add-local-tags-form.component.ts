import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder, private bs: BatchService) { }


  isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors
      && form.controls[field].touched;
  }

  isValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'A value is required!';

        case 'minlength':
          return `At least ${errors['minlength'].requiredLength} characters required!`;
      }
    }

    return null;
  }

  public addLocalTagsForm: FormGroup = this.fb.group({
    localTags: this.fb.array([])
  });

  public localTag: FormControl = new FormControl('', Validators.required);

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
    // TO-DO check for no duplicates
    console.log("new localTag " + this.localTag.value);
    if (this.localTag.invalid) return;
    console.log("new localTag " + this.localTag.value);
    const tag = this.localTag.value;
    console.log("new localTag " + tag);
    this.tagsToAdd.push(
      this.fb.control(tag, Validators.required)
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
    //this.addLocalTagsForm.reset();
  }

}
