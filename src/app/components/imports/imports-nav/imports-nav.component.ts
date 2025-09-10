import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, HostListener, inject, OnInit, signal } from '@angular/core';
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
  templateUrl: './imports-nav.component.html'
})
export class ImportsNavComponent implements OnInit {

  router = inject(Router);
  msgSvc = inject(MessageService);
  importsSvc = inject(ImportsService);
  aaSvc = inject(AaService);
  translateSvc = inject(TranslateService);
  private document = inject(DOCUMENT);

  mobile: boolean | null = null;
  mobile_options: HTMLElement | null = null;

  isMoreShown: boolean = false;

  ngOnInit(): void {
    if (!this.importsSvc.hasImports()) this.importsSvc.checkImports();
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
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
    this.collapse();
  }

  collapse() {
    if (this.mobile) {
      if (!this.mobile_options) this.mobile_options = this.document.getElementById('side_nav_mobile_options');
      if (this.mobile_options?.classList.contains('show')) this.mobile_options!.classList.remove('show');
    }
  }

  showMore(): boolean {
    this.isMoreShown = !this.isMoreShown;
    return this.isMoreShown;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    const viewWidth = document.documentElement.offsetWidth || 0;
    this.mobile = viewWidth < 1400 ? true : false;
  }

}
