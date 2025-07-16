import { Injectable } from '@angular/core';

import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ImportValidatorsService {

  constructor() { }

  notValidField(control: AbstractControl): boolean | null {
    return control.errors
      && control.touched;
  }

  notValidFieldInArray(formArray: FormArray, index: number) {
    return formArray.controls[index].errors
      && formArray.controls[index].touched;
  }

  getFieldError(control: AbstractControl): string | null {
    if (!control) return null;

    const errors = control.errors || {};
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return ' value is required!';

        case 'minlength':
          return ` at least ${errors['minlength'].requiredLength} characters required!`;

        case 'forbiddenURLValidator':
          return " can't be a URL!";

        case 'allRequired':
          return " not all required values!";
      }
    }
    return null;
  }

  forbiddenURLValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { forbiddenURL: { value: control.value } } : null;
    };
  }

  // Validator repeated on Batch and Imports. TO-DO: unique validators service on shared components
  allRequiredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        let error = false;
        Object.keys(control.controls).forEach(key => {
          const field = control.get(key);
          if (field!.hasValidator(Validators.required) && !(field!.dirty)) {
            error = true;
            return;
          }
        });
        control.setErrors(error ? { allRequired: true } : null);
        return error ? { allRequired: true } : null;
      }

      return null;
    }
  }

}
