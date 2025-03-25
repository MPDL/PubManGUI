import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, Input, Output, EventEmitter, LOCALE_ID, inject } from '@angular/core'
import { RouterModule, Router } from '@angular/router';

import { ImportsService } from 'src/app/components/imports/services/imports.service';
import { ImportLogDbVO, ImportStatus, ImportErrorLevel } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormsModule } from '@angular/forms';

import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'pure-import-log',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbTooltip,
    MatBadgeModule
  ],
  templateUrl: './import-log.component.html'
})
export class ImportLogComponent implements OnInit {
  @Input() log?: ImportLogDbVO;
  @Output() deleteImportLogEvent = new EventEmitter<ImportLogDbVO>();

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);

  importStatusTranslations = {};
  importErrorLevelTranslations = {};
  importFormatTranslations = {};

  importStatus: typeof ImportStatus = ImportStatus;
  importErrorLevel: typeof ImportErrorLevel = ImportErrorLevel;

  updateDelay = 1;

  constructor(
    @Inject(LOCALE_ID) public locale: string) { }

  ngOnInit(): void {
    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importErrorLevelTranslations = msgs.ImportErrorLevel;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    }
  }

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
        const msg = $localize`:@@imports.list.items.empty:This import has no items available!` + '\n';
        this.msgSvc.info(msg);
        return;
      }
      this.router.navigate(['/imports/myimports/' + id + '/datasets'], { state: { itemList: items } });
    })
  }

  deleteImportLog(log: any): void {
    let ref = this.msgSvc.displayConfirmation({ text: $localize`:@@imports.list.remove.confirmation:Do you really want to remove this import log?`, confirm: $localize`:@@confirm:Confirm`, cancel: $localize`:@@cancel:Cancel` });
    ref.closed.subscribe(confirmed => {
      if (confirmed) {
        this.deleteImportLogEvent.emit(log);
      }
    });
  }

  getImportStatusTranslation(txt: string): string {
    let key = txt as keyof typeof this.importStatusTranslations;
    return this.importStatusTranslations[key];
  }

  getImportFormatTranslation(txt: string): string {
    let key = txt as keyof typeof this.importFormatTranslations;
    return this.importFormatTranslations[key];
  }

  getImportErrorLevelTranslation(txt: string): string {
    let key = txt as keyof typeof this.importErrorLevelTranslations;
    return this.importErrorLevelTranslations[key];
  }

}
