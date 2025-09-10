import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";
import { IdType } from "src/app/model/inge";
import { isFormValueEmpty } from "../../utils/utils";

export const SubjectValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const id_type = IdType;
  let subject = control;
  if (subject !== null) {
    if (!isFormValueEmpty(subject.get('value')?.value)) {
      if (isFormValueEmpty(subject.get('type')?.value)) {
        subject.get('type')?.setErrors({[error_types.SUBJECT_TYPE_NOT_PROVIDED] : true});

        //return { [error_types.SUBJECT_TYPE_NOT_PROVIDED]: true };
      }
      else {
        subject.get('type')?.setErrors(null);
      }
    } // if
  } // if
  return null;
}
