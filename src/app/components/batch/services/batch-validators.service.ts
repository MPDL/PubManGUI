import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from "src/app/model/errors";

import { _, TranslateService } from '@ngx-translate/core'

@Injectable({
  providedIn: 'root'
})
export class BatchValidatorsService {

  translateSvc = inject(TranslateService);

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
          return this.translateSvc.instant(_('validation.required'))

        case 'minlength':
          return this.translateSvc.instant(_('validation.minlength'), { minLength: errors['minlength'].requiredLength })

        case 'notEquals':
          return this.translateSvc.instant(_('validation.notEquals'))

      }
    }
    return null;
  }

  notSameValues(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const error_types = Errors;
      if (control instanceof FormGroup) {
        if (control.get(field1)?.dirty || control.get(field2)?.dirty) {
          let field1Value = control.get(field1)?.value;
          let field2Value = control.get(field2)?.value;
          if (typeof field1Value === 'string') {
            field1Value = field1Value.trim();
          }
          if (typeof field2Value === 'string') {
            field2Value = field2Value.trim();
          };
          if (field1Value !== null && field2Value !== null) {
            if (field2Value.length > 0 && (field1Value === field2Value)) {
              return { [error_types.OLD_AND_NEW_ARE_SAME]: {value: control.value} };
              //return { notEquals: true }
            }
          }
        }
      }
      return null;
    }
  }

}
