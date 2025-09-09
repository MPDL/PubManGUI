import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";

export const SourceValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const source = control;
  if (source.get('genre')?.value === null || source.get('genre')?.value === '') {
    source.get('genre')?.setErrors({[error_types.SOURCE_GENRE_NOT_PROVIDED] : true});
    //return { [error_types.SOURCE_GENRE_NOT_PROVIDED] : true };
  }
  else {
    source.get('genre')?.setErrors(null);
  }
  return null;
}
