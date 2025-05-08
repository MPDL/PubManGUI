import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { catchError, defaultIfEmpty, map, Observable, of } from 'rxjs';
import { ValidationService } from 'src/app/services/pubman-rest-client/validation.service';

@Injectable({
  providedIn: 'root'
})
export class CreatorValidationDirective {
  constructor(private validationService: ValidationService) {
    }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    console.log('validating Creator control');
    const formGroup = control as FormGroup;
    // console.log('this', this);
    return this.validationService.validateCreator(formGroup.value).pipe(
      map(response => {
        console.log('Mapping');
        console.log('Response Creator validation', JSON.stringify(response));
        console.log('Response Creator validation validity: ', JSON.stringify(response.valid));
        if (response.valid == false) {
          console.log('invalid creator');
          console.log('response creator items',  JSON.stringify(response.items));
          let  validationErrors: ValidationErrors = {};
        if (response.valid == false) {
          if (response.items != null && response.items.length > 0) {
            response.items.forEach((item: any) => {
              validationErrors[item.content as string] = true;
            });
          }
          console.log('validationErrors', validationErrors);
          return validationErrors;
        } else {
          return null;
        }
        } else {
          console.log('valid creator');
          return null;
        }
      }),
      catchError(error => {
        console.log('error', error);
        return of({ invalidCreator: true });
      }),
      defaultIfEmpty(null),
    );
  }
}
