import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Errors } from "src/app/model/errors";

export const Utf8Validator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const text: string = control.value;
  if (text !== null && text !== '') {
      for (let i = 0; i < text.length; i++) {
      const chr = text.charCodeAt(i);
      if (chr < 0x20 && chr !== 0x9 && chr !== 0xA && chr !== 0xD
        || chr > 0xD7FF && (chr < 0xE000 || chr === 0xFFFE || chr === 0xFFFF || chr > 0x10FFFF)) {
        return { [error_types.NO_UTF8_CHAR_IN_ABSTRACT] : true };
      }
    }
  }
  return null;
}
