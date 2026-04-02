import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CreatorType} from 'src/app/model/inge';
import {Errors} from 'src/app/model/errors'
import {isFormValueEmpty} from "../../utils/utils";

export const CreatorsOrganizationsValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const creators = control as FormArray;
  let ok:boolean = false;
  let errorOrg:boolean = false;
  //control.get('genre')?.markAsTouched();
  for (let creator of creators.controls) {
    switch (creator.get('type')?.value) {
      case CreatorType.ORGANIZATION:
        const organization = creator.get('organization');
        if (organization !== null && !isFormValueEmpty(organization.get('name')?.value)) {
          ok = true;
        } else {
          errorOrg = true;
        }
        break;
      case CreatorType.PERSON:
        const person = creator.get('person');
        if (person !== null) {
          const personOrganizations = person.get('organizations') as FormArray;
          for (let organization of personOrganizations.controls) {
            if (organization !== null && !isFormValueEmpty(organization.get('name')?.value)) {
              ok = true;
            }
          }
        }
        break;
    }
  }
  if (!ok) {
    //control?.setErrors({[error_types.ORGANIZATIONAL_METADATA_NOT_PROVIDED] : true});
    return { [error_types.ORGANIZATIONAL_METADATA_NOT_PROVIDED]: true };
  }
  return null;
}
