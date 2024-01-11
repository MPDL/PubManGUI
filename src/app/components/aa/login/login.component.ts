import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'pure-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private builder: FormBuilder,
    private dialogRef: DialogRef<string>,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm && this.loginForm.valid) {
      this.dialogRef.close(this.loginForm.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
