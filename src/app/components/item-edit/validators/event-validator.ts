import { inject } from "@angular/core";
import { ValidationService } from "src/app/services/pubman-rest-client/validation.service";

export class EventValidator {

    //inject validationService
    private validationService= inject(ValidationService);


    /*
    public validateEvent() : ValidatorFn {
      console.log('validating Event');
        return (control: AbstractControl) => {
            // Assuming the control is a FormGroup, you can cast it
            console.log('validating Event control');
            const formGroup = control as FormGroup;
            this.validationService.validateEvent(formGroup.value).pipe(
              map(response => {
                if (response.status >= 400) {
                  return { invalidEvent: true };
                }
                return null;
              }),
              catchError(error => {
                return of({ invalidEvent: true });
              })
            );
          };
    }
          */
}
