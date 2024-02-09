import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';
import { LanguageFormComponent } from '../language-form/language-form.component';
import { SubjectVO } from 'src/app/model/inge';

@Component({
  selector: 'pure-subject-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    LanguageFormComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent {
  @Input() subject_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Input() multi !: boolean;
  @Output() notice = new EventEmitter();

  add_remove_subject(event: any) {
    this.notice.emit(event);
  }

}
