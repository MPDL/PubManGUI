import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ConeAutosuggestComponent } from "../../shared/cone-autosuggest/cone-autosuggest.component";
import { ValidationErrorMessageDirective } from "../../../directives/validation-error-message.directive";

@Component({
  selector: 'pure-abstract-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    BootstrapValidationDirective,
    ValidationErrorMessageDirective,
    ConeAutosuggestComponent,
  ],
  templateUrl: './abstract-form.component.html',
  styleUrl: './abstract-form.component.scss'
})
export class AbstractFormComponent {
  @Input() abstract_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi !: boolean;
  @Output() notice = new EventEmitter();

  error_types = Errors;

  get abstract_language () {
    return this.abstract_form.get('language') as FormControl;
  }

  add_remove_abstract(event: any) {
    this.notice.emit(event);
  }
}
