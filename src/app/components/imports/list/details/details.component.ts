import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import LogComponent  from './log/log.component';

@Component({
  selector: 'pure-imports-list-details',
  standalone: true,
  imports: [
    CommonModule,
    NgbTooltip,
    LogComponent
  ],
  templateUrl: './details.component.html'
})
export default class DetailsComponent { 
  
  private modalService = inject(NgbModal);

  log = `FN Clarivate Analytics Web of Science
FN Clarivate Analytics Web of Science
VR 1.0
PT J
AU Romary, Laurent
TI OA&#64;MPS - a colourful view
SO ZEITSCHRIFT FUR BIBLIOTHEKSWESEN UND BIBLIOGRAPHIE
VL 54
IS 4-5
BP 211
EP 215
DT Article
PD AUG-OCT 2007
PY 2007
RI Romary, Laurent/A-5114-2012
OI Romary, Laurent/0000-0002-0756-0508
Z8 0
ZR 0
ZB 0
ZS 0
TC 0
ZA 0
Z9 0
SN 0044-2380
DA 2007-08-01
UT WOS:000251331600010
ER`;

  open(log: string) {
    const modalRef = this.modalService.open(LogComponent, {
      size: 'md',
    });
    modalRef.componentInstance.log = log;
  }

}
