import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdType } from 'src/app/model/inge';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';

@Component({
  selector: 'pure-identifier-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent],
  templateUrl: './identifier-form.component.html',
  styleUrls: ['./identifier-form.component.scss']
})
export class IdentifierFormComponent {

  @Input() identifier_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  error_types = Errors;

  identifier_types = Object.keys(IdType);

  add_remove_identifier(event: any) {
    this.notice.emit(event);
  }
}
