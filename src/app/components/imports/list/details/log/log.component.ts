import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'pure-imports-details-log',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './log.component.html'
})
export default class LogComponent { 
  activeModal = inject(NgbActiveModal);

  @Input() log: string = '';
}
