import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import { UserService } from '../../services/user.service';
import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  displayLoadingPanel = false;

  constructor(
      private fb: FormBuilder,
      private router: Router,
      private snackBar: MatSnackBar,
      private loginService: UserService
  ) { }

  ngOnInit() {
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
              this.router.navigate(['/login']);
              this.snackBar.open('Account created, you can now connect!', null, { duration: 3000 });
            },
            () => {
              this.displayLoadingPanel = false;
              this.snackBar.open('Email already use!', null, { duration: 1500 });
            }
        );
  }

}
