import { Injectable } from '@angular/core';

import { FormGroup, FormArray, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

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

        case 'singleWord':
          return " can't contain multiple words!";

        case 'notEquals':
          return " can't be the same!";

        case 'equals':
          return " do not match!";  

        case 'notDuplicates':
          return " duplicate!";
      }
    }
    return null;
  }

  singleWordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.dirty || control.touched) {
        const words = control.value.split(/[\s,.;:|]./);
        return words.length > 1 ? { singleWord: true } : null;
      }
      return null;
    }
  }

  uniqueWordsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.dirty || control.touched) {
        const words = control.value.split(/[\s,.;:|]./);
        // TO-DO
        return null;
      }
      return null;
    }
  }

  notEqualsValidator(field1: string, field2: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        if (control.dirty || control.touched) {
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
              control.get(field2)?.setErrors({ notEquals: true });
              return { notEquals: true }
            }
          }
        }
      }
      control.get(field2)?.setErrors(null);
      return null;
    }
  }

  equalsValidator(field1: string, field2: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormGroup) {
        if (control.dirty || control.touched) {
          const field1Value = control.get(field1)?.value.trim();
          const field2Value = control.get(field2)?.value.trim();

          if (field2Value.length > 0 && (field1Value !== field2Value)) {
            control.get(field2)?.setErrors({ equals: true });
            return { equals: true }
          }
        }
      }
      control.get(field2)?.setErrors(null);
      return null;
    }
  }

  noDuplicatesValidator(array: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (array instanceof FormArray && array.length > 0) {
        let valueList: any[] = array.value;
        let match = ( new Set(valueList).size ) !== valueList.length;
        control.setErrors({ noDuplicates: true });
        return match ? { noDuplicates: true } : null;
      }
      control.setErrors(null);
      return null;
    }
  }

}
