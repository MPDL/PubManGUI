import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CreatorType } from 'src/app/model/inge';
import { Errors } from 'src/app/model/errors'

export const CreatorsOrganizationsValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const creators = control.get('creators') as FormArray;
  let ok:boolean = false; 
  let errorOrg:boolean = false;
  for (let creator of creators.controls) {
    switch (creator.get('type')?.value) {
      case CreatorType.ORGANIZATION:
        const organization = creator.get('organization');
        if (organization !== null && organization.get('name')?.value !== null) {
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
            if (organization !== null && organization.get('name')?.value !== null) {
              ok = true;
            } 
          }
        }
        break;
    }
  }
  if (!ok) {
    return { [error_types.ORGANIZATIONAL_METADATA_NOT_PROVIDED]: true };
  }
  return null;
}
