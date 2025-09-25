import {
  ContentChild,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  Optional, Renderer2,
  Self,
  ViewChild,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import { AbstractControl, AbstractControlDirective, ControlContainer, NgControl } from "@angular/forms";
import { ValidationErrorComponent } from "../components/shared/validation-error/validation-error.component";

/**
 * Directive to apply Bootstrap validation styling to Angular form elements based on their validation state.
 * This directive attaches validation classes (`is-invalid`) dynamically to form controls
 * to reflect their error state.
 *
 * The directive can be used with template-driven, reactive forms, or a combination of both.
 */
@Directive({
  selector: '[formControlName],[ngModel],[formControl],[formArray],[formArrayName],[formGroup],[formGroupName]',

})

export class BootstrapValidationDirective {

  private control : AbstractControl | null = null;

  constructor(@Self() @Optional() private cd: NgControl, @Self() @Optional() private cont: ControlContainer) {

  }

  ngOnInit() {
    this.control = this.cd?.control || this.cont?.control;
  }


  @HostBinding('class.is-invalid')
  get isInvalid(): boolean {
    return isShowValidationError(this.control);
  }

}
export function isShowValidationError(control: AbstractControl | undefined | null): boolean {
  return control !==null && control!== undefined && control.invalid && control.touched;
}
