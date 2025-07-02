import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from 'src/app/model/errors';
import { CreatorType } from 'src/app/model/inge';

export const creatorValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const creator = control;
  if (creator !== null && creator.get('role')?.value === null) {
    switch (creator.get('type')?.value) {
      case CreatorType.ORGANIZATION:
        const o = creator.get('organization');
        if (o !== null) {
          if (o.get('name')?.value ||
            o.get('adress')?.value) {
            return { [error_types.CREATOR_ROLE_NOT_PROVIDED]: true };
          }
        }
        break;
      case CreatorType.PERSON:
        const p = creator.get('person');
        if (p !== null) {
          if (p.get('familyName')?.value ||
            p.get('givenName')?.value) {
            return { [error_types.CREATOR_ROLE_NOT_PROVIDED]: true };
          }
          const personOrgs = p.get('organizations') as FormArray;
          if (personOrgs) {
            let j = 1;
            for (const organization of personOrgs.controls) {
              if (organization !== null) {
                if (organization.get('name')?.value ||
                  organization.get('adress')?.value) {
                  return { [error_types.CREATOR_ROLE_NOT_PROVIDED]: true };
                } // if
              } // if
              j++;
            } // for
          } // if
          break;
        } // if
    } // switch
  } // if
  return null;
}