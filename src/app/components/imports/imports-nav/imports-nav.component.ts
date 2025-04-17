import { CommonModule } from '@angular/common';
import { OnInit, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';

import { TranslatePipe } from "@ngx-translate/core";

interface NavOption {
  route: string;
  label: string;
  disabled: boolean;
}

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

  public navList = signal<NavOption[]>([
    { route: '/imports/new', label: 'new', disabled: false },
    { route: '/imports/myimports', label: 'myimports', disabled: false },
  ]);

  constructor(
    public aaSvc: AaService,
    private importsSvc: ImportsService,
    private msgSvc: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.navList()[0].disabled = !this.importsSvc.hasImports();
    this.navList()[1].disabled = !this.importsSvc.hasImports();
  }

  warning(option: string) {
    switch (option) {
      case '/imports/myimports':
        if (!this.importsSvc.hasImports()) {
          this.msgSvc.warning($localize`:@@imports.list.empty:No imports available!`+'\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
      case '/imports/new':
        if (this.importsSvc.isImportRunning()) {
          this.msgSvc.warning($localize`:@@imports.fileImport.running:Please wait, an import is running!`+'\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
    }
  }

}