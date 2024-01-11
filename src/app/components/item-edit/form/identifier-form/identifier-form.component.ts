import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IdType } from 'src/app/model/inge';

@Component({
  selector: 'pure-identifier-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './identifier-form.component.html',
  styleUrls: ['./identifier-form.component.scss']
})
export class IdentifierFormComponent {

  @Input() identifier_form!: FormGroup;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  identifier_types = Object.keys(IdType);

  addIdentifier() {
    this.notice.emit('add');
  }

  removeIdentifier() {
    this.notice.emit('remove');
  }
}
