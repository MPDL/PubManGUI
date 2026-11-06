import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { AaService } from 'src/app/services/aa.service';
import { LoginComponent } from './login/login.component';

import { NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { UserProfileComponent } from "../user-profile/user-profile.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
    selector: 'pure-aa',
    templateUrl: './aa.component.html',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NgbTooltip, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu, TranslatePipe]
})
export class AaComponent {

  // The component is rendered twice (desktop header and mobile header), so the
  // dropdown id must be unique to keep `aria-labelledby` unambiguous.
  private static nextId = 0;
  readonly dropdownId = `navbarDropdown${AaComponent.nextId++}`;

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
