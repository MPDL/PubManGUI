import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AaService } from 'src/app/services/aa.service';
import { LoginComponent } from './login/login.component';
import { NgIf } from '@angular/common';
import { NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { UserProfileComponent } from "../user-profile/user-profile.component";

@Component({
    selector: 'pure-aa',
    templateUrl: './aa.component.html',
    standalone: true,
  imports: [NgIf, RouterLink, NgbTooltip]
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
  protected readonly UserProfileComponent = UserProfileComponent;
}
