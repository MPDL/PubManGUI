import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/services/message.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';

import { _, TranslatePipe, TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'pure-imports-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './imports-nav.component.html'
})
export class ImportsNavComponent implements OnInit {

  router = inject(Router);
  msgSvc = inject(MessageService);
  importsSvc = inject(ImportsService);
  aaSvc = inject(AaService);
  translateSvc = inject(TranslateService);

  isMoreShown: boolean = false;

  ngOnInit(): void {
    this.importsSvc.checkImports();
  }

  whenReady(option: string) {
    switch (option) {
      case '/imports/myimports':
        if (!this.importsSvc.hasImports()) {
          this.msgSvc.warning(this.translateSvc.instant(_('imports.list.empty')) + '\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
      case '/imports/new':
        if (this.importsSvc.isImportRunning()) {
          this.msgSvc.warning(this.translateSvc.instant(_('imports.fileImport.running')) + '\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
    }
  }

  showMore(): boolean {
    this.isMoreShown = !this.isMoreShown;
    return this.isMoreShown;
  }

}
