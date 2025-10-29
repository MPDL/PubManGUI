import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MdsPublicationGenre } from "src/app/model/inge";
import { Errors } from "src/app/model/errors";
import { isFormValueEmpty } from "../../utils/utils";

export const datesValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const event = control.get('event');
  const genre = control.get('genre');
  genre?.markAsTouched();
  if (MdsPublicationGenre.SERIES == genre?.value
    || MdsPublicationGenre.JOURNAL == genre?.value
    || MdsPublicationGenre.MANUSCRIPT == genre?.value
    || MdsPublicationGenre.OTHER == genre?.value) {
    return null;
  }
  else if (MdsPublicationGenre.COURSEWARE_LECTURE == genre?.value
    || MdsPublicationGenre.TALK_AT_EVENT == genre?.value
    || MdsPublicationGenre.POSTER == genre?.value) {

    if (datesEmpty(control) && event && isFormValueEmpty(event.get('startDate')?.value)) {
      event.setErrors({[Errors.DATE_OR_EVENT_DATE_NOT_PROVIDED]: true});
      return { [Errors.DATE_OR_EVENT_DATE_NOT_PROVIDED]: true };
    }
    else {
      event?.setErrors(null);
      return null;
    }

  }
  //All othrer genres
  else {
    if(datesEmpty(control)) {
      return {[Errors.DATE_NOT_PROVIDED]: true};
    }
  }

  return null;
}
  const datesEmpty = (control: AbstractControl) : boolean => {
    const dateAccepted = control.get('dateAccepted')
    const dateCreated = control.get('dateCreated');
    const dateModified = control.get('dateModified');
    const datePublishedInPrint = control.get('datePublishedInPrint');
    const datePublishedOnline = control.get('datePublishedOnline');
    const dateSubmitted = control.get('dateSubmitted');
    return isFormValueEmpty(dateAccepted?.value)
      && isFormValueEmpty(dateCreated?.value)
      && isFormValueEmpty(dateModified?.value)
      && isFormValueEmpty(datePublishedInPrint?.value)
      && isFormValueEmpty(datePublishedOnline?.value)
      && isFormValueEmpty(dateSubmitted?.value);


}

