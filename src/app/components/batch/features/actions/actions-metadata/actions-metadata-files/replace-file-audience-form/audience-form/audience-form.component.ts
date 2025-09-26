import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';

import type { IpEntry } from 'src/app/services/pubman-rest-client/miscellaneous.service';

import { _, TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'pure-audience-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddRemoveButtonsComponent,
    TranslatePipe
  ],
  templateUrl: './audience-form.component.html'
})
export class AudienceFormComponent {

  @Input() ous!: IpEntry[];
  @Input() audienceId!: FormControl;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  add_remove_audience(event: any) {
    this.notice.emit(event);
  }

}
