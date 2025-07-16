import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlternativeTitleType } from 'src/app/model/inge';
import {
  AddRemoveButtonsComponent
} from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { Errors } from 'src/app/model/errors';

@Component({
  selector: 'pure-alt-title-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent],
  templateUrl: './alt-title-form.component.html',
  styleUrls: ['./alt-title-form.component.scss']
})
export class AltTitleFormComponent {

  @Input() alt_title_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();


  alt_title_types = Object.keys(AlternativeTitleType);
  alt_title_langs = ['bay', 'deu', 'eng', 'fra', 'esp'];

  error_types = Errors;

  add_remove_alt_title(event: any) {
    this.notice.emit(event);
  }
}


