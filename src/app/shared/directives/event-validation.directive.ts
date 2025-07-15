import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from 'src/app/model/errors';

export const EventValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const event = control;
  const error_types = Errors;
  if (event !== null) {
    if ((event.get('title')?.value === null || event.get('title')?.value === '') &&
        ((event.get('endDate')?.value !== null && event.get('endDate')?.value !== '') ||
        (event.get('invitationStatus')?.value !== null && event.get('invitationStatus')?.value !== '')  ||
        (event.get('place')?.value !== null && event.get('place')?.value !== '') ||
        (event.get('startDate')?.value !== null && event.get('startDate')?.value !== ''))) {
      return { [error_types.EVENT_TITLE_NOT_PROVIDED]: true };
    }
  }
  return null;
}
