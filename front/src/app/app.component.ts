import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {StorageService, LOCAL_STORAGE} from 'angular-webstorage-service';
import {MatSnackBar} from "@angular/material";

@Component(
  {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.css']
  }
)
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: UserService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService
  ) {
  }

  ngOnInit(): void {
      if (this.loginService.canReconnect()) {

          this
              .loginService
              .reconnect()
              .subscribe(
                  (user) => {
                      this.snackBar.open('Welcome back ' + user.username, null, { duration: 1500 });
                  },
                  () => {
                      this.snackBar.open('Cannot reconnect', null, { duration: 1500 });
                  }
              );
      }
  }

  isConnected() {
    return null !== this.loginService.getCurrentUser();
  }

  logout() {
    this.loginService.disconnect();
    this.router.navigate(['/']);
  }
}
