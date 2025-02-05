import { CommonModule } from '@angular/common';
import { OnInit, Component, Inject, LOCALE_ID, HostListener, inject } from '@angular/core';
import { RouterModule, Router, NavigationExtras } from '@angular/router';

import { ImportsService } from '../services/imports.service';
import { ImportLogDbVO, ImportStatus, ImportErrorLevel } from 'src/app/model/inge';
import { MessageService } from 'src/app/shared/services/message.service';

import { FormsModule } from '@angular/forms';

import { PaginatorComponent } from "src/app/shared/components/paginator/paginator.component";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'pure-import-logs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginatorComponent,
    NgbTooltip,
    MatBadgeModule
  ],
  templateUrl: './import-logs.component.html'
})
export default class ListComponent implements OnInit {

  importsSvc = inject(ImportsService);
  msgSvc = inject(MessageService);
  router = inject(Router);

  currentPage = this.importsSvc.lastPageNumFrom().myImports;
  pageSize = 25;
  collectionSize = 0;
  inPage: ImportLogDbVO[] = [];
  logs: ImportLogDbVO[] = [];

  importStatusTranslations = {};
  importFormatTranslations = {};

  importErrorLevel: typeof ImportErrorLevel = ImportErrorLevel;

  isScrolled = false;

  constructor(
    @Inject(LOCALE_ID) public locale: string) {}

  ngOnInit(): void {
    this.importsSvc.getImportLogs()
      .subscribe(importsResponse => {
        this.logs = importsResponse.sort((b, a) => a.id - b.id);
        this.collectionSize = this.logs.length;
        this.refreshLogs();
        return;
      }
      );

    this.loadTranslations(this.locale);
  }

  async loadTranslations(lang: string) {
    if (lang === 'de') {
      await import('src/assets/i18n/messages.de.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    } else {
      await import('src/assets/i18n/messages.json').then((msgs) => {
        this.importStatusTranslations = msgs.ImportStatus;
        this.importFormatTranslations = msgs.ImportFormat;
      })
    }
  }

  refreshLogs() {
    this.pageSize = this.getPreferredPageSize();
    this.inPage = this.logs.map((log, i) => ({ _id: i + 1, ...log })).slice(
      (this.currentPage - 1) * this.pageSize,
      (this.currentPage - 1) * this.pageSize + (this.pageSize),
    );
    this.importsSvc.lastPageNumFrom().myImports = this.currentPage;
  }

  getPreferredPageSize():number {
    if (sessionStorage.getItem('preferredPageSize') && Number.isFinite(+sessionStorage.getItem('preferredPageSize')!)) {
      return +sessionStorage.getItem('preferredPageSize')!;
    } else return this.pageSize;
  }

  calculateProcessedStep(numberOfItems: number): number {
    return Math.floor(100 / numberOfItems);
  };

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
        this.importsSvc.deleteImportLog(log.id).subscribe(importsResponse => {
          console.log(importsResponse);
        })

        let element = document.getElementById(log.id) as HTMLElement;
        element.remove();
    
        this.logs = this.logs.filter(item => item.id != log.id);
        this.collectionSize = this.logs.length;
        this.refreshLogs();
      }
    });
    return; 
  }

  getImportStatusTranslation(txt: string): string {
    let key = txt as keyof typeof this.importStatusTranslations;
    return this.importStatusTranslations[key];
  }

  getImportFormatTranslation(txt: string):string {
    let key = txt as keyof typeof this.importFormatTranslations;
    return this.importFormatTranslations[key];
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50 ? true : false;
  }
}
