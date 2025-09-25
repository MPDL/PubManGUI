import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ValidationErrorMessageDirective } from "../../../directives/validation-error-message.directive";

@Component({
  selector: 'pure-publishing-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe, BootstrapValidationDirective, ValidationErrorMessageDirective],
  templateUrl: './publishing-info-form.component.html',
  styleUrl: './publishing-info-form.component.scss'
})
export class PublishingInfoFormComponent {
  @Input() publishing_info_form!: FormGroup;
}
