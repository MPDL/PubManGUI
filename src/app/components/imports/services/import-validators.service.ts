import { Injectable } from '@angular/core';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ImportValidatorsService {

  constructor() { }

  notValidField(control: AbstractControl): boolean | null {
    return control.errors
      && control.touched;
  }

  getErrorMsg(control: AbstractControl): string | null {
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

}
