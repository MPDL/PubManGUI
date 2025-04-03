import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import {Component, TemplateRef} from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { AaService } from 'src/app/services/aa.service';
import { LoginComponent } from './login/login.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExportItemsComponent} from "../../shared/components/export-items/export-items.component";

@Component({
    selector: 'pure-aa',
    templateUrl: './aa.component.html',
    standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, ExportItemsComponent, LoginComponent]
})
export class AaComponent {

  dialog_conf = {
    hasBackdrop: false,
    panelClass: 'pure-dialog',
  }

  constructor(
    public aa: AaService,
    private msg: MessageService,
    protected modalService: NgbModal
  ) { }


  sign_out() {
    this.aa.logout();
  }

  protected readonly LoginComponent = LoginComponent;
}
