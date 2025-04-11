import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, FormControl, FormGroup, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { catchError, defaultIfEmpty, finalize, map, Observable, of, takeUntil} from 'rxjs';
import { ValidationService } from 'src/app/services/pubman-rest-client/validation.service';

@Injectable({
  providedIn: 'root'
})
export class EventValidationDirective implements AsyncValidator {
  constructor(private validationService: ValidationService) {
  }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('validating Event control');
    const formGroup = control as FormGroup;
    console.log('this', this);
    return this.validationService.validateEvent(formGroup.value).pipe(
      map(response => {
        console.log('Mapping');
        console.log('Response', JSON.stringify(response));
        console.log('Response validity: ', JSON.stringify(response.valid));
        if (response.valid == false) {
          console.log('invalid event');
          formGroup.get('title')?.setErrors({ titleMissing: true});
          // do not add: formGroup.updateValueAndValidity(); 
          // this will prevent the validity from being updated after the return value
          return { invalidEvent: true };
        } else {
          console.log('valid event');
          return null;
        }
      }),
      catchError(error => {
        console.log('error', error);
        return of({ invalidEvent: true });
      }),
      defaultIfEmpty(null),
    );
  }
}

/*
export function validateEvent(validationService: ValidationService): AsyncValidatorFn {
  console.log('validating Event control');
    const formGroup = control as FormGroup;
    console.log('this', this);
    return this.validationService.validateEvent(formGroup.value).pipe(
      map(response => {
        if (response.status >= 400) {
          return { invalidEvent: true };
        } else {
          return null;
        }
      }),
      catchError(error => {
        return of({ invalidEvent: true });
      }),
      defaultIfEmpty(null),
    );
}
  */