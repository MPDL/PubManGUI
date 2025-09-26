import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AaService } from "../../../services/aa.service";
import { catchError, EMPTY, tap, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PubManHttpErrorResponse } from "../../../services/interceptors/http-error.interceptor";
import { ValidationErrorComponent } from "../../shared/validation-error/validation-error.component";
import { ChangePasswordComponent } from "../../shared/change-password/change-password.component";
import { MessageService } from "../../../services/message.service";
import { TranslateService } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";

@Component({
    selector: 'pure-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ValidationErrorComponent, ChangePasswordComponent, BootstrapValidationDirective]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  errorMessage?:string

  @Input() forcedLogout = false;

  showPasswordChange:boolean = false;

  constructor(
    private builder: FormBuilder,
    protected activeModal: NgbActiveModal,
    private aa: AaService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {

  }

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm && this.loginForm.valid) {
      this.aa.login(this.loginForm.get('username')?.value, this.loginForm.get('password')?.value)
        .pipe(
          tap( p=> {
            this.activeModal.dismiss("login_success");
          }),
          catchError ((err: PubManHttpErrorResponse) => {
            this.errorMessage = err.userMessage
            if(err.jsonMessage?.passwordChangeRequired) {
              this.showPasswordChange = true;
            }
            return EMPTY;

          })
        )
        .subscribe()

    }
  }

  passwordChanged(newPasswd: any) {
    this.showPasswordChange = false;
    this.loginForm.get('password')?.setValue(newPasswd);
    this.errorMessage = undefined;
    this.messageService.success(this.translateService.instant('common.updateSuccessful'));

  }
}
