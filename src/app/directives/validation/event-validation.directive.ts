import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from 'src/app/model/errors';
import { isFormValueEmpty } from "../../utils/utils";

export const EventValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const event = control;
  const error_types = Errors;
  if (event !== null) {
    if (isFormValueEmpty(event.get('title')?.value) &&
        (!isFormValueEmpty(event.get('endDate')?.value) ||
        !isFormValueEmpty(event.get('invitationStatus')?.value)  ||
        !isFormValueEmpty(event.get('place')?.value) ||
        !isFormValueEmpty(event.get('startDate')?.value))) {
      event.get('title')?.setErrors({[error_types.EVENT_TITLE_NOT_PROVIDED] : true});
      //return { [error_types.EVENT_TITLE_NOT_PROVIDED]: true };
    }
    else {
      event.get('title')?.setErrors(null);
    }
  }
  return null;
}
