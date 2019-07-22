import { Component, OnInit }                from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UserService }                      from '../../services/user.service';
import { MatSnackBar }                      from '@angular/material';
import { Router }                           from '@angular/router';

@Component(
  {
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
  }
)
export class RegisterComponent implements OnInit {

  loginForm = this.fb.group(
    {
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {validators: RegisterComponent.validateRegistrationForm}
  );

  displayLoadingPanel = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: UserService
  ) {
  }

  ngOnInit() {
  }

  static validateRegistrationForm(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPassword = group.controls.confirmPassword.value;

    return pass === confirmPassword ? null : { notSame: true }
  }

  register() {
    this.displayLoadingPanel = true;

    this
      .loginService
      .register(
        this.loginForm.get('email').value,
        this.loginForm.get('password').value,
      )
      .subscribe(
        () => {
          this.snackBar.open('Account created, connecting...', null, {duration: 3000});

          this
            .loginService
            .connect(
              this.loginForm.get('email').value,
              this.loginForm.get('password').value,
              true
            )
            .subscribe(
              () => {
                this.router.navigate(['/']);
              },
              () => {
                this.displayLoadingPanel = false;
                // add notification bad credential
                this.snackBar.open('Bad credential', null, {duration: 1500});
              }
            );
        },
        () => {
          this.displayLoadingPanel = false;
          this.snackBar.open('Email already use!', null, {duration: 3000});
        }
      );
  }

}
