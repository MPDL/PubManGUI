import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';
import { LanguageAutosuggestComponent } from 'src/app/components/shared/language-autosuggest/language-autosuggest.component';

@Component({
  selector: 'pure-abstract-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
    FormsModule,
    LanguageAutosuggestComponent,
    ReactiveFormsModule,
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
