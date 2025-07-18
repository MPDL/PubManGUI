import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MdsPublicationGenre } from "src/app/model/inge";
import { Errors } from "src/app/model/errors";

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

  if (!dateAccepted?.value && !dateCreated?.value && !dateModified?.value && !datePublishedInPrint?.value && !datePublishedOnline?.value && !dateSubmitted?.value) {

    if (MdsPublicationGenre.COURSEWARE_LECTURE == genre?.value
      || MdsPublicationGenre.TALK_AT_EVENT == genre?.value
      || MdsPublicationGenre.POSTER == genre?.value
      && (event && event.get('startDate'))) {
      return null;
    }
    return { [error_types.DATE_NOT_PROVIDED]: true };
  }

  return null;

}

