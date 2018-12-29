import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  displayLoadingPanel = false;

  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: UserService
  ) {
  }

  ngOnInit(): void {
    if (this.loginService.canReconnect()) {
      this.displayLoadingPanel = true;

      this
        .loginService
        .reconnect()
        .subscribe(
          () => {
            this.router.navigate([this.getRefererUrl()]);
          },
          () => {
            this.displayLoadingPanel = false;
            this.snackBar.open('Cannot reconnect', null, { duration: 1500 });
          }
        );
    }

  }

  connect() {
    this.displayLoadingPanel = true;

    this
      .loginService
      .connect(
        this.loginForm.get('login').value,
        this.loginForm.get('password').value,
        this.loginForm.get('rememberMe').value
      )
      .subscribe(
        () => {
          this.router.navigate([this.getRefererUrl()]);
        },
        () => {
          this.displayLoadingPanel = false;
          // add notification bad credential
          this.snackBar.open('Bad credential', null, { duration: 1500 });
        }
      );
  }

  getRefererUrl() {
    return this.route.snapshot.queryParams['referer'] || '/home';
  }
}
