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

const strongPasswordRegx: RegExp =
  /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,32}$/;

@Component({
  selector: 'pure-user-profile',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})

export class UserProfileComponent {

  principal: Principal;
  changePasswordForm: FormGroup;

  passwordChangeSuccess = false;
  passwordChangeLoading = false;
  errorMessage?: string;



  constructor(private aaService: AaService, protected activeModal: NgbActiveModal, private formBuilder: FormBuilder, private usersService: UsersService) {
    this.principal = aaService.principal.getValue();
    this.changePasswordForm = formBuilder.group({
      //oldPassword: ['', Validators.required],
      newPassword1: new FormControl('',
        {validators : [Validators.required, Validators.pattern(strongPasswordRegx)]}
      ),
      newPassword2: new FormControl('',
        {validators : [Validators.required, Validators.pattern(strongPasswordRegx)]}
      )
    });
  }


  changePassword() {
    this.passwordChangeLoading = true;
    this.errorMessage = undefined;
    this.passwordChangeSuccess = false;

    const newPassword1 = this.changePasswordForm.get("newPassword1")?.value;
    const newPassword2 = this.changePasswordForm.get("newPassword2")?.value;

    if(newPassword1 !== newPassword2) {
      this.errorMessage = "Passwords do not match";
      this.passwordChangeLoading = false;
      return;
    }

    this.usersService.changePassword(this.principal.user?.objectId!, this.changePasswordForm.get('newPassword1')?.value, {globalErrorDisplay: false})
      .pipe(
        tap((result) => {
          this.passwordChangeLoading = false;
          this.passwordChangeSuccess = true;
          this.changePasswordForm.reset();
        }),
        catchError((error: PubManHttpErrorResponse) => {

          this.errorMessage = error.userMessage;
          return EMPTY;
        })

      )
      .subscribe()
  }
}
