import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core'
import { Router, RouterModule } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportErrorLevel, ImportLogDbVO, ImportStatus } from 'src/app/model/inge';
import { MessageService } from 'src/app/services/message.service';

import { FormsModule } from '@angular/forms';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { MatBadgeModule } from '@angular/material/badge';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";

import { LocalizeDatePipe } from "src/app/pipes/localize-date.pipe";

@Component({
  selector: 'pure-import-log',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbTooltip,
    MatBadgeModule,
    TranslatePipe,
    LocalizeDatePipe
  ],
  templateUrl: './import-log.component.html'
})
export class ImportLogComponent {
  @Input() log?: ImportLogDbVO;
  @Output() deleteImportLogEvent = new EventEmitter<ImportLogDbVO>();

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);
  translateSvc = inject(TranslateService);

  importStatus: typeof ImportStatus = ImportStatus;
  importErrorLevel: typeof ImportErrorLevel = ImportErrorLevel;

  updateDelay = 1;

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

  isFinished(status: ImportStatus): boolean {
    if (status === ImportStatus.FINISHED) {
      return true;
    }
    return false;
  }

  toDatasets(id: any): void {
    let items: string[] = [];
    this.importsSvc.getImportLogItems(id).subscribe(importsResponse => {
      if (importsResponse.length === 0) return;

      importsResponse.sort((a, b) => a.id - b.id)
        .forEach(element => {
          if (element.itemId) {
            items.push(element.itemId);
          }
        });
      if (items.length === 0) {
        const msg = this.translateSvc.instant(_('imports.list.items.empty')) + '\n';
        this.msgSvc.info(msg);
        return;
      }
      this.router.navigate(['/imports/myimports/' + id + '/datasets'], { state: { itemList: items } });
    })
  }

  deleteImportLog(log: any): void {
    let ref = this.msgSvc.displayConfirmation({ text: this.translateSvc.instant('imports.list.remove.confirmation', { name: log.name }), confirm: this.translateSvc.instant(_('common.confirm')), cancel: this.translateSvc.instant(_('common.cancel')) });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.deleteImportLogEvent.emit(log);
      }
    });
  }
}
