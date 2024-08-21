import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/shared/components/add-remove-buttons/add-remove-buttons.component';

import type { ipList }  from 'src/app/components/batch/interfaces/actions-responses';

@Component({
  selector: 'pure-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AddRemoveButtonsComponent
  ],
  templateUrl: './audience-form.component.html'
})
export class AudienceFormComponent { 

  @Input() ous!: ipList[];
  @Input() audienceId!: FormControl;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  ngOnInit() {
    if(this.audienceId.value.name === '') {
      this.audienceId.setValue($localize`:@@batch.actions.metadata.files.ipRanges.singular:Range`);
    }
  }
  
  add_remove_audience(event: any) {
    this.notice.emit(event);
  }

}
