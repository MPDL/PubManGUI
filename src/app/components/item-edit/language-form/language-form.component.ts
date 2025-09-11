import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { ConeAutosuggestComponent } from "../../shared/cone-autosuggest/cone-autosuggest.component";

@Component({
  selector: 'pure-language-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AddRemoveButtonsComponent, ConeAutosuggestComponent],
  templateUrl: './language-form.component.html',
  styleUrl: './language-form.component.scss'
})
export class LanguageFormComponent {
  @Input() language_form!: FormControl;
  @Input() index_length!: number;
  @Input() index!: number;
  @Input() multi!: boolean;
  @Output() notice = new EventEmitter();

  miscellaneousService = inject(MiscellaneousService);

  add_remove_identifier(event: any) {
    this.notice.emit(event);
  }

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }
}
