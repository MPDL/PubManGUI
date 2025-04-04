import { Directive, inject } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { of, Subject, takeUntil } from 'rxjs';
import { ValidationService } from 'src/app/services/pubman-rest-client/validation.service';



@Directive({
  selector: '[pureEventValidation]',
  standalone: true
})
export class EventValidationDirective implements Validator {
  private validationService = inject(ValidationService);

  validate(control: AbstractControl): ValidationErrors | null {
    return validateEvent(this.validationService)(control);
  }
}

export function validateEvent(validationService: ValidationService): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log('validating Event control');
    const formGroup = control as FormGroup;
    var finalise = new Subject();
    return validationService.validateEvent(formGroup.value).pipe(takeUntil(finalise)).subscribe({
      next: (response) => {
        console.log('ValidationResponse');
        console.log(response); // Log the response for debugging purposes

        if (response.status >= 400) {
          console.log('Event validation failed:', response.status);
          return { invalidEvent: true };
        } else {
          console.log('Event validation succeeded:', response.status);
          return null
        }
      },
      error: (error) => {
        return of({ invalidEvent: true });
      },
      complete: () => {
        finalise.complete();
      }
    });

  };
}