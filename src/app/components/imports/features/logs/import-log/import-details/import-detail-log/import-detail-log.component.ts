import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogItemDbVO } from 'src/app/model/inge';

import { MessageService } from 'src/app/services/message.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslatePipe } from "@ngx-translate/core";
import { LocalizeDatePipe } from "src/app/pipes/localize-date.pipe";


@Component({
  selector: 'pure-detail-log',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    TranslatePipe,
    LocalizeDatePipe
  ],
  templateUrl: './import-detail-log.component.html'
})
export class ImportDetailLogComponent {
    @Input() item?: ImportLogItemDbVO;

  importsSvc = inject(ImportsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  msgSvc = inject(MessageService);

  getAssorted(txt: string): string {
    switch (txt) {
      case 'FINE':
      case 'WARNING':
      case 'FATAL':
        return txt;
      default:
        return 'ERROR';
    }
  }
}
