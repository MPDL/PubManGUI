import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { Errors } from 'src/app/model/errors';
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ConeAutosuggestComponent } from "../../shared/cone-autosuggest/cone-autosuggest.component";
import { ValidationErrorMessageDirective } from "../../../directives/validation-error-message.directive";


@Component({
  selector: 'pure-subject-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
    BootstrapValidationDirective,
    ValidationErrorMessageDirective,
    ConeAutosuggestComponent
  ],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent {
  @Input() subject_form!: FormGroup;
  @Input() subject_classification_types!: string[];
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi !: boolean;
  @Output() notice = new EventEmitter();

  error_types = Errors;

  miscellaneousService = inject(MiscellaneousService);


  ngOnInit() {

    //set type value to null if type does not exist, e.g. because the context was changed before
    const type = this.subject_form.get('type')?.value;
    if(type && !this.subject_classification_types.includes(type)) {
      this.subject_form.get("type")?.setValue(null);
    }
  }

  add_remove_subject(event: any) {
    this.notice.emit(event);
  }

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }

}
