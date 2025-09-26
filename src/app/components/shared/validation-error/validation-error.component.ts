import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Errors } from "../../../model/errors";
import { Subscription } from "rxjs";
import {
  DATE_PATTERN,
  FILE_TITLE_AND_NAME_PATTERN,
  ORCID_PATTERN,
  STRONG_PASSWORD_REGEX_PATTERN
} from "../../../services/form-builder.service";

@Component({
  selector: 'pure-validation-error',
  imports: [],
  templateUrl: './validation-error.component.html',
  styleUrl: './validation-error.component.scss'
})
export class ValidationErrorComponent {

  @Input() control: AbstractControl<any> | null = null;
  @Input() validationError?: ValidationErrors;
  @Input() name = '';

  @Input() onlyForTouched = true;

  errorMessages: string[] = [];
  statusSubscription?: Subscription;

  constructor(private translateService: TranslateService) {
  }
  ngOnInit() {
    if(this.control) {

      this.updateMessages(this.control?.errors);
      this.statusSubscription = this.control.events.subscribe(status => {
          this.updateMessages(this.control?.errors)
      })
    }

    if(this.validationError) {
      this.updateMessages(this.validationError)
    }
  }

  ngOnDestroy() {
    this.statusSubscription?.unsubscribe();
  }

  updateMessages(errs: ValidationErrors | null | undefined) {
    this.errorMessages = [];
    for(const key  in errs) {
      const err = errs[key];
      this.errorMessages.push(this.getTranslatedErrorMessage(key, err));
      //console.log("VALIDATION ERROR: " +key + " " + err);
    }
  }

  private getTranslatedErrorMessage(key: string, val: any) {

    const x = 1;
    switch (key) {
      case 'required':
      case Errors.COMPONENT_CONTENT_CATEGORY_NOT_PROVIDED.toString() :
      case Errors.COMPONENT_CONTENT_NOT_PROVIDED.toString() :
      case Errors.COMPONENT_FILE_NAME_NOT_PROVIDED.toString() :
      case Errors.COMPONENT_VISIBILITY_NOT_PROVIDED.toString() :
      case Errors.CREATOR_FAMILY_NAME_NOT_PROVIDED.toString() :
      case Errors.CREATOR_GIVEN_NAME_NOT_PROVIDED.toString() :
      case Errors.CREATOR_NOT_PROVIDED.toString() :
      case Errors.CREATOR_ORGANIZATION_NAME_NOT_PROVIDED.toString() :
      case Errors.CREATOR_ROLE_NOT_PROVIDED.toString() :
      case Errors.CREATOR_TYPE_NOT_PROVIDED.toString() :
      case Errors.DATE_ACCEPTED_NOT_PROVIDED.toString() :
      case Errors.EVENT_TITLE_NOT_PROVIDED.toString() :
      case Errors.ID_TYPE_NOT_PROVIDED.toString() :
      case Errors.SOURCE_GENRE_NOT_PROVIDED.toString() :
      case Errors.SUBJECT_TYPE_NOT_PROVIDED.toString() :
      case Errors.SUBJECT_VALUE_NOT_PROVIDED.toString() :
      case Errors.ALT_TITLE_VALUE_NOT_PROVIDED.toString() :
      case Errors.ALT_TITLE_TYPE_NOT_PROVIDED.toString() :
      {

        return this.translateService.instant('validation.required');
      }
      case 'pattern' : {
        switch(val.requiredPattern) {
          case DATE_PATTERN.toString() : {
            return this.translateService.instant('validation.invalidDateFormat');
          }
          case ORCID_PATTERN.toString() : {
            return this.translateService.instant('validation.invalidOrcid');
          }
          case FILE_TITLE_AND_NAME_PATTERN.toString() : {
            return this.translateService.instant('validation.invalidFileName');
          }
          case STRONG_PASSWORD_REGEX_PATTERN.toString() : {
            return this.translateService.instant('validation.passwordRule');
          }
          default :{
            return "Invalid pattern, expected " + val.requiredPattern;
          }
        }

      }
      case Errors.CREATOR_ORCID_INVALID.toString() :
        return this.translateService.instant('validation.invalidOrcid');
      case Errors.DATE_NOT_PROVIDED.toString() :
        return this.translateService.instant('validation.minOneDate');
      case Errors.INCORRECT_ID_DOI_FORMAT.toString() :
        return this.translateService.instant('validation.invalidDoi');
      case Errors.LOCATOR_IS_NO_URI.toString() :
        return this.translateService.instant('validation.invalidUrlFormat');
      case Errors.NO_UTF8_CHAR_IN_ABSTRACT.toString() :
        return this.translateService.instant('validation.invalidUtfChar');
      case Errors.ORGANIZATIONAL_METADATA_NOT_PROVIDED.toString() :
        return this.translateService.instant('validation.minOneAffForCreator');
      case Errors.SOURCE_NOT_PROVIDED.toString() :
        return this.translateService.instant('validation.sourceNotProvided');
      case Errors.COMPONENT_IP_RANGE_NOT_PROVIDED.toString() :
        return this.translateService.instant('validation.ipRangeNotProvided');
      case Errors.FORBIDDEN_URL.toString() :
        return this.translateService.instant('validation.forbiddenUrl');
      case Errors.OLD_AND_NEW_ARE_SAME.toString() :
        return this.translateService.instant('validation.notSameValues');  
      default : {
        const errorNumber = parseInt(key);
        if(!isNaN(errorNumber)) {
          return this.name + " - " + Errors[errorNumber];
        }
        else {
          return "Unknown error - " + key + ": " + val;
        }
      }
    }
  }
}
