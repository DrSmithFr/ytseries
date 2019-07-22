import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component(
  {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  }
)
export class LoginComponent implements OnInit {

  displayLoadingPanel = false;

  loginForm = this.fb.group(
    {
      login: ['', Validators.required],
      password: ['', Validators.required],
    }
  );

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: UserService
  ) {
  }

  ngOnInit(): void {
    this.loginService.userConnected.subscribe(() => {
      this.router.navigate([this.getRefererUrl()]);
    });
  }

  connect() {
    this.displayLoadingPanel = true;

    this
      .loginService
      .connect(
        this.loginForm.get('login').value,
        this.loginForm.get('password').value,
        true
      )
      .subscribe(
        () => {
          this.router.navigate([this.getRefererUrl()]);
        },
        () => {
          this.displayLoadingPanel = false;
          // add notification bad credential
          this.snackBar.open('Bad credential', null, {duration: 1500});
        }
      );
  }

  getRefererUrl() {
    return this.route.snapshot.queryParams['referer'] || '/';
  }
}
