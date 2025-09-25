import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ValidationErrorMessageDirective } from "../../../directives/validation-error-message.directive";

@Component({
  selector: 'pure-legal-case-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe,BootstrapValidationDirective, ValidationErrorMessageDirective],
  templateUrl: './legal-case-form.component.html',
  styleUrl: './legal-case-form.component.scss'
})

export class LegalCaseFormComponent {
  @Input() legal_case_form!: FormGroup;
}
