import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from "src/app/model/errors";


@Injectable({
  providedIn: 'root'
})
export class ImportValidatorsService {
  forbiddenURLValidator(nameRe: RegExp): ValidatorFn {
    const error_types = Errors;
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? { [error_types.FORBIDDEN_URL]: { value: control.value } } : null;
    };
  }
}