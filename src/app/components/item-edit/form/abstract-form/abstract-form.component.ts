import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';

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


  add_remove_abstract(event: any) {
    this.notice.emit(event);
  }
}
