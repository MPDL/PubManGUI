import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MdsPublicationGenre } from "src/app/model/inge";
import { Errors } from "src/app/model/errors";
import { isFormValueEmpty } from "../../utils/utils";

export const datesValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const dateAccepted = control.get('dateAccepted')
  const dateCreated = control.get('dateCreated');
  const dateModified = control.get('dateModified');
  const datePublishedInPrint = control.get('datePublishedInPrint');
  const datePublishedOnline = control.get('datePublishedOnline');
  const dateSubmitted = control.get('dateSubmitted');
  const event = control.get('event');
  const genre = control.get('genre');
  genre?.markAsTouched();
  if (MdsPublicationGenre.SERIES == genre?.value
    || MdsPublicationGenre.JOURNAL == genre?.value
    || MdsPublicationGenre.MANUSCRIPT == genre?.value
    || MdsPublicationGenre.OTHER == genre?.value) {
    return null;
  }

  if (isFormValueEmpty(dateAccepted?.value)
    && isFormValueEmpty(dateCreated?.value)
    && isFormValueEmpty(dateModified?.value)
    && isFormValueEmpty(datePublishedInPrint?.value)
    && isFormValueEmpty(datePublishedOnline?.value)
    && isFormValueEmpty(dateSubmitted?.value)) {

    if ((MdsPublicationGenre.COURSEWARE_LECTURE == genre?.value
      || MdsPublicationGenre.TALK_AT_EVENT == genre?.value
      || MdsPublicationGenre.POSTER == genre?.value))
    {
      if (event && isFormValueEmpty(event.get('startDate')?.value)) {
          event.setErrors({[error_types.DATE_OR_EVENT_DATE_NOT_PROVIDED]: true});
          return { [error_types.DATE_OR_EVENT_DATE_NOT_PROVIDED]: true };
      }
      else {
        event?.setErrors(null);
        return null;
      }

    }
    //control.setErrors({[error_types.DATE_NOT_PROVIDED] : true})
    return { [error_types.DATE_NOT_PROVIDED]: true };
  }

  return null;

}

