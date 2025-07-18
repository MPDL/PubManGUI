import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { SubjectClassification } from 'src/app/model/inge';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';


@Component({
  selector: 'pure-subject-form',
  standalone: true,
  imports: [
    AddRemoveButtonsComponent,
    CommonModule,
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

  miscellaneousService = inject(MiscellaneousService);

  subject_classification_types = Object.keys(SubjectClassification);

  add_remove_subject(event: any) {
    this.notice.emit(event);
  }

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }

}
