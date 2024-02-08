import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }


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


  // addLocalTags(List<String> itemIds, List<String> localTags, String userId, String token);
  public addLocalTagsForm: FormGroup = this.fb.group({
    localTags: this.fb.array([])
  });

  public localTag: FormControl = new FormControl('', Validators.required);

  /* TO-DO */

  // Local tags
  get tagsToAdd() {
    return this.addLocalTagsForm.get('localTags') as FormArray;
  }

  onAddToNewTags(): void {
    // TO-DO check no duplicates
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

  // TO-DO
  onSubmit(): void {
    if (this.addLocalTagsForm.invalid) {
      this.addLocalTagsForm.markAllAsTouched();
      return;
    }

    console.log(this.addLocalTagsForm.value);
    //this.addLocalTagsForm.reset();
  }

}
