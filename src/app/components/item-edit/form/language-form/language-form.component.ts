import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { LanguageAutosuggestComponent } from 'src/app/shared/components/language-autosuggest/language-autosuggest.component';

@Component({
  selector: 'pure-language-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent, LanguageAutosuggestComponent],
  templateUrl: './language-form.component.html',
  styleUrl: './language-form.component.scss'
})
export class LanguageFormComponent {
  @Input() language_form!: FormControl;
  @Input() index_length!: number;
  @Input() index!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  add_remove_identifier(event: any) {
    this.notice.emit(event);
  }
}
