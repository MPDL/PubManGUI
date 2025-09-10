import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";
import { IdType } from "src/app/model/inge";
import { isFormValueEmpty } from "../../utils/utils";

export const alternativeTitleValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  let subject = control;
  if (subject !== null) {
    if (!isFormValueEmpty(subject.get('value')?.value) && isFormValueEmpty(subject.get('type')?.value)) {
        subject.get('type')?.setErrors({[Errors.ALT_TITLE_TYPE_NOT_PROVIDED] : true});
        //return { [error_types.SUBJECT_TYPE_NOT_PROVIDED]: true };
      }
      else {
        subject.get('type')?.setErrors(null);
      }

    if (isFormValueEmpty(subject.get('value')?.value) && (!isFormValueEmpty(subject.get('type')?.value) || !isFormValueEmpty(subject.get('language')?.value))) {
      subject.get('value')?.setErrors({[Errors.ALT_TITLE_VALUE_NOT_PROVIDED] : true});
      //return { [error_types.SUBJECT_TYPE_NOT_PROVIDED]: true };
    }
    else {
      subject.get('value')?.setErrors(null);
    }
  } // if
  return null;
}
