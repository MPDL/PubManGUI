import { CommonModule } from '@angular/common';
import { OnInit, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';

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
    RouterModule],
  templateUrl: './imports-nav.component.html'
})
export class ImportsNavComponent implements OnInit {

  public navList = signal<NavOption[]>([
    { route: '/imports/new', label: $localize`:@@new:new`, disabled: false },
    { route: '/imports/myimports', label: $localize`:@@myimports:My imports`, disabled: false },
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

  // TO-DO ???
  warning(option: string) {
    switch (option) {
      case '/imports/myimports':
        if (!this.importsSvc.hasImports()) {
          this.msgSvc.warning(`No imports available!\n`);
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
      case '/imports/new':
        if (this.importsSvc.isImportRunning()) {
          this.msgSvc.warning(`Please wait, an import is running!\n`);
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
    }
  }

}