import {Component} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AaService, Principal} from "../../services/aa.service";
import {UsersService} from "../../services/pubman-rest-client/users.service";
import {ChangePasswordComponent} from "../shared/change-password/change-password.component";


@Component({
  selector: 'pure-user-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordComponent,
    TranslatePipe
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent {

  principal: Principal;



  constructor(private aaService: AaService, protected activeModal: NgbActiveModal, private formBuilder: FormBuilder, private usersService: UsersService) {
    this.principal = aaService.principal.getValue();

  }

}
