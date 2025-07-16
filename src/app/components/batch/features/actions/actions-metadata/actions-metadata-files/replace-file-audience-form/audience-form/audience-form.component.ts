import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRemoveButtonsComponent } from 'src/app/shared/components/add-remove-buttons/add-remove-buttons.component';

import type { IpEntry } from 'src/app/services/pubman-rest-client/miscellaneous.service';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

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

  translateSvc = inject(TranslateService);

  ngOnInit() {
    if(this.audienceId.value.name === '') {
      this.audienceId.setValue(this.translateSvc.instant(_('batch.actions.metadata.files.ipRanges.singular')));
    }
  }

  add_remove_audience(event: any) {
    this.notice.emit(event);
  }

}
