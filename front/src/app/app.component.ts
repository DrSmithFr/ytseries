import {Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService }                           from './services/user.service';
import { Router }                                from '@angular/router';
import { StorageService, LOCAL_STORAGE }         from 'angular-webstorage-service';
import { MatSnackBar }                           from '@angular/material';
import {DOCUMENT}                                from '@angular/common';

@Component(
  {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  }
)
export class AppComponent implements OnInit {
  windowScrolled: boolean;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private loginService: UserService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.windowScrolled = false;
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

  ngOnInit(): void {
    if (this.loginService.canReconnect()) {

      this
        .loginService
        .reconnect()
        .subscribe(
          (user) => {
            this.snackBar.open('Welcome back ' + user.username, null, {duration: 1500});
          },
          () => {
            this.snackBar.open('Cannot reconnect', null, {duration: 1500});
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
