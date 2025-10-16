import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";
import { MdsPublicationGenre } from "src/app/model/inge";
import { isFormValueEmpty } from "../../utils/utils";

export const DegreeRequiredValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {

  const metadata = control.parent as FormGroup;
  const genre = metadata?.get('genre')?.value;
  if (genre === MdsPublicationGenre.THESIS) {
      if ( isFormValueEmpty(control.value))  {
        //control.setErrors({[error_types.SOURCE_NOT_PROVIDED] : true})
        return { [Errors.DEGREE_NOT_PROVIDED]: true };
      }
  }
  return null;
}
