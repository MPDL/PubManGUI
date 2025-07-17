import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Errors } from 'src/app/model/errors';
import { CreatorType } from 'src/app/model/inge';

const ORCID_HTTPS = 'https://orcid.org/';
const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-(\d{3}X|\d{4})$/;

export const creatorValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const creator = control;
  let currentErrors = {} as ValidationErrors;
  if (creator !== null ) {
    switch (creator.get('type')?.value) {
      case CreatorType.ORGANIZATION:
        const organization = creator.get('organization');
        if (organization !== null) {
          if (organization.get('name')?.value ||
            organization.get('adress')?.value) {
            currentErrors[error_types.CREATOR_ROLE_NOT_PROVIDED] = true;
          }
          if (!organization.get('name')?.value) {
              currentErrors[error_types.CREATOR_ORGANIZATION_NAME_NOT_PROVIDED] = true;
            }
        }
        break;
      case CreatorType.PERSON:
        const person = creator.get('person');
        if (person !== null) {
          if (!person.get('familyName')?.value) {
            currentErrors[error_types.CREATOR_FAMILY_NAME_NOT_PROVIDED] =  true;
          }
          if ((person.get('familyName')?.value ||
            person.get('givenName')?.value) && creator.get('role')?.value === null) {
            currentErrors[error_types.CREATOR_ROLE_NOT_PROVIDED] = true;
          }
          const orcid = person.get('orcid');
          if (orcid !== null && orcid.value !== null) {
            if (!orcid.value.startsWith(ORCID_HTTPS)) {
              currentErrors[error_types.CREATOR_ORCID_INVALID] = true;
            } else if ((!orcid.value.substring(ORCID_HTTPS.length).matches(ORCID_REGEX))) {
              currentErrors[error_types.CREATOR_ORCID_INVALID] = true;
            }
          } // if
          const personOrganizations = person.get('organizations') as FormArray;
          if (personOrganizations) {
            let j = 1;
            for (const organization of personOrganizations.controls) {
              if (organization !== null) {
                console.log('organization.get("name")?.value , organization.get("address")?.value', organization.get('name')?.value, organization.get('adress')?.value);
                if ((organization.get('name')?.value ||
                  organization.get('adress')?.value) && creator.get('role')?.value === null ) {
                  currentErrors[error_types.CREATOR_ROLE_NOT_PROVIDED] = true;
                } // if
                else if (organization.get('name')?.value === null &&
                  organization.get('adress')?.value) {
                  currentErrors[error_types.CREATOR_ORGANIZATION_NAME_NOT_PROVIDED] = true;
                }
              }
              j++;
            } // for
          } // if
          break;
        } // if
    } // switch
    return currentErrors;
  } // if
  return null;
}
