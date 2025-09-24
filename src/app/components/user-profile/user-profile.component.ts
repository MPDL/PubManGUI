import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { LoadingComponent } from "../shared/loading/loading.component";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AaService, Principal } from "../../services/aa.service";
import { UsersService } from "../../services/pubman-rest-client/users.service";
import { catchError, EMPTY, of, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PubManHttpErrorResponse } from "../../services/interceptors/http-error.interceptor";
import { ChangePasswordComponent } from "../shared/change-password/change-password.component";



@Component({
  selector: 'pure-user-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ChangePasswordComponent
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
