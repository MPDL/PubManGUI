import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AaService } from "../../../services/aa.service";
import { tap } from "rxjs";

@Component({
    selector: 'pure-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  errorMessage?:string

  @Input() forcedLogout = false;

  constructor(
    private builder: FormBuilder,
    protected activeModal: NgbActiveModal,
    private aa: AaService
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
          })
        )
        .subscribe(
          {
            error : (e) => {
              this.errorMessage = "Could not log in";
            }
          }
        )

    }
  }

}
