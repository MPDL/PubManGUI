import { CommonModule } from '@angular/common';
import { OnInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ImportsNavComponent } from './imports-nav/imports-nav.component';

import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { ImportsService } from './services/imports.service';

@Component({
  selector: 'pure-imports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ImportsNavComponent
  ],
  templateUrl: './imports.component.html',
})
export default class ImportsComponent implements OnInit {

  constructor(
    public aaSvc: AaService,
    private importsSvc: ImportsService,
    private msgSvc: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (!this.aaSvc.principal.getValue().loggedIn) {
      this.msgSvc.warning(`Please, log in!\n`);
      this.msgSvc.dialog.afterAllClosed.subscribe(result => {
        this.router.navigate(['/'])
      }) 
    }

    if (this.importsSvc.haveImports()) {
      this.router.navigate(['/imports/myimports'])
    } else {
      this.router.navigate(['/imports/new'])
    }

  }
}  
