import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Storage } from "src/app/model/inge";
import { Errors } from "src/app/model/errors";
import { isFormValueEmpty } from "../../utils/utils";

export const fileUrlValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const URL_PATTERN = /^(https?:\/\/|ftp:\/\/).*/;
  const file = control.value;
  if (Storage.EXTERNAL_URL === file.storage) {
    const content = control.get("content")?.value;
    console.log(URL_PATTERN.test(content));
    if (!isFormValueEmpty(content) && !URL_PATTERN.test(content)) {
      control.get("content")?.setErrors({[error_types.LOCATOR_IS_NO_URI] : true});
        //return {[error_types.LOCATOR_IS_NO_URI]: true};
      return {};
    }
  }
  return null;
}
