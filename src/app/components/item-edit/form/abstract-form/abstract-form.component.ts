import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';
import { LanguageFormComponent } from '../language-form/language-form.component';

@Component({
  selector: 'pure-abstract-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    LanguageFormComponent,
    FormsModule,
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

  add_remove_abstract(event: any) {
    this.notice.emit(event);
  }

}
