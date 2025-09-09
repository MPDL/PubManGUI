import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";
import { IdType } from "src/app/model/inge";
import { isFormValueEmpty } from "../../utils/utils";

export const IdentifierValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const id_type = IdType;
  let identifier = control;
  if (identifier !== null) {
    if (!isFormValueEmpty(identifier.get('id')?.value)) {
      if (isFormValueEmpty(identifier.get('type')?.value)) {
        identifier.get('type')?.setErrors({[error_types.ID_TYPE_NOT_PROVIDED] : true});
        //return { [error_types.ID_TYPE_NOT_PROVIDED]: true };

      }
      else {
        identifier.get('type')?.setErrors(null);
        // Check format of the IDs
        if ((id_type.BIORXIV.valueOf() === identifier.get('type')?.value ||
          id_type.CHEMRXIV.valueOf() === identifier.get('type')?.value ||
          id_type.DOI.valueOf() === identifier.get('type')?.value ||
          id_type.EARTHARXIV.valueOf() === identifier.get('type')?.value ||
          id_type.EDARXIV.valueOf() === identifier.get('type')?.value ||
          id_type.ESS_OPEN_ARCHIVE.valueOf() === identifier.get('type')?.value ||
          id_type.MEDRXIV.valueOf() === identifier.get('type')?.value ||
          id_type.PSYARXIV.valueOf() === identifier.get('type')?.value ||
          id_type.RESEARCH_SQUARE.valueOf() === identifier.get('type')?.value ||
          id_type.SOCARXIV.valueOf() === identifier.get('type')?.value) &&
          (identifier.get('id')?.value.startsWith("https://doi.org") || identifier.get('id')?.value.startsWith("http://doi.org"))) {

          identifier.get('id')?.setErrors({[error_types.INCORRECT_ID_DOI_FORMAT] : true});
          //return { [error_types.INCORRECT_ID_DOI_FORMAT]: true };

        }// if
        else {
          identifier.get('id')?.setErrors(null);
        }
      } // else
    } // if
  } // if
  return null;
}
