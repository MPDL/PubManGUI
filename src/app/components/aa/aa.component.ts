import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { AaService } from 'src/app/services/aa.service';
import { LoginComponent } from './login/login.component';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
    selector: 'pure-aa',
    templateUrl: './aa.component.html',
    styleUrls: ['./aa.component.scss'],
    standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe]
})
export class AaComponent {

  dialog_conf = {
    hasBackdrop: false,
    panelClass: 'pure-dialog',
  }

  constructor(
    private dialog: Dialog,
    public aa: AaService,
    private msg: MessageService,
  ) { }

  sign_in() {
    const ref = this.dialog.open(LoginComponent, this.dialog_conf);
    ref.closed.pipe(
      switchMap((form: any) => {
        console.log("Login dialog"+ form);
        if(form) {
          return this.aa.login(form.username, form.password);
          //return this.aa.principal.asObservable()
        }
        else return EMPTY
      }),
      catchError(err => {
        this.msg.error(err);
        return EMPTY;
      })
    ).subscribe();
  }

  sign_out() {
    this.aa.logout();
  }

}
