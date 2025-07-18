import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';

@Component({
  selector: 'pure-abstract-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
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

  error_types = Errors;

  add_remove_abstract(event: any) {
    this.notice.emit(event);
  }
}
