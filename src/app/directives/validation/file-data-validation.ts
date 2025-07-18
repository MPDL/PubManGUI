import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { FileDbVO, Storage, Visibility } from "src/app/model/inge";
import { Errors } from "src/app/model/errors";

export const fileDataValidator: ValidatorFn = (control: AbstractControl,): ValidationErrors | null => {
  const error_types = Errors;
  const file = control.value as FileDbVO;
  let currentErrors = {} as ValidationErrors;
  if (file != null) {
    //External reference with missing content
    if ((Storage.EXTERNAL_URL === file.storage) && (file.content === null || file.content === undefined || file.content === '')) {
      currentErrors[error_types.COMPONENT_CONTENT_NOT_PROVIDED] =  true;
    }
    //File with missing content or missing objectId
    if (Storage.INTERNAL_MANAGED === file.storage) { 
      if ((file.content === null || file.content === undefined || file.content === '')
      && (file.objectId === null || file.objectId === undefined || file.objectId == '')) {
      currentErrors[error_types.COMPONENT_CONTENT_NOT_PROVIDED] = true;
      }
      if (Visibility.AUDIENCE === file.visibility) {
        let ok = false;
        for (let audienceId of file.allowedAudienceIds) {
          if (audienceId !== null && audienceId !== undefined && audienceId !== '' && Object.keys(audienceId).length !== 0) {
            ok = true;
          }
        }
        if (!ok) {
          currentErrors[error_types.COMPONENT_IP_RANGE_NOT_PROVIDED] = true;
        }
      }
    }
    // Metadata validation
    if (file.metadata !== null && file.metadata !== undefined) {
      // File with missing title
      if (file.metadata.title === null || file.metadata.title === undefined || file.metadata.title === '') {
        currentErrors[error_types.COMPONENT_FILE_NAME_NOT_PROVIDED] = true;
      }
      // File with missing content category
      if ((file.metadata.contentCategory === null || file.metadata.contentCategory === undefined || file.metadata.contentCategory === '')) {
        currentErrors[error_types.COMPONENT_CONTENT_CATEGORY_NOT_PROVIDED] = true;
      }
    }
    //File with missing visibility (internal managed files only)
    if (Storage.EXTERNAL_URL !== file.storage && (file.visibility === null || file.visibility === undefined)) {
      currentErrors[error_types.COMPONENT_VISIBILITY_NOT_PROVIDED] =  true;
    }

  } // if
  return currentErrors;
}
