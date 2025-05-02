import { CommonModule } from '@angular/common';
import { OnInit, Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ImportsService } from 'src/app/components/imports/services/imports.service';

import { TranslatePipe } from "@ngx-translate/core";
import { TranslateService, _ } from '@ngx-translate/core';

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

  router = inject(Router);
  msgSvc = inject(MessageService);
  importsSvc = inject(ImportsService);
  aaSvc = inject(AaService);
  translateSvc = inject(TranslateService);

  public navList = signal<NavOption[]>([
    { route: '/imports/new', label: 'new', disabled: false },
    { route: '/imports/myimports', label: 'myimports', disabled: false },
  ]);

  ngOnInit(): void {
    this.navList()[0].disabled = !this.importsSvc.hasImports();
    this.navList()[1].disabled = !this.importsSvc.hasImports();
  }

  warning(option: string) {
    switch (option) {
      case '/imports/myimports':
        if (!this.importsSvc.hasImports()) {
          this.msgSvc.warning(this.translateSvc.instant(_('imports.list.empty'))+'\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
      case '/imports/new':
        if (this.importsSvc.isImportRunning()) {
          this.msgSvc.warning(this.translateSvc.instant(_('imports.fileImport.running'))+'\n');
          this.msgSvc.dialog.afterAllClosed.subscribe(result => {
            this.router.navigate(['/imports'])
          })
        }
        break;
    }
  }

}