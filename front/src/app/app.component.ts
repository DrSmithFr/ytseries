import {Component, HostListener, Inject, OnInit} from '@angular/core';
import { UserService }                           from './services/user.service';
import { Router }                                from '@angular/router';
import { StorageService, LOCAL_STORAGE }         from 'angular-webstorage-service';
import { MatSnackBar }                           from '@angular/material';
import {DOCUMENT}                                from '@angular/common';
import {SwUpdate}                                from '@angular/service-worker';

@Component(
  {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  }
)
export class AppComponent implements OnInit {
  windowScrolled: boolean;
  promptEvent: any;

  constructor(
    private router: Router,
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    private loginService: UserService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    // install button display
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    swUpdate.available.subscribe(() => {
      // TODO ask before reload
      window.location.reload();
    });

    this.windowScrolled = false;
  }

  @HostListener("window:beforeinstallprompt", [])
  onWindowBeforeInstallPrompt() {

  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
      return;
    }

    if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
      return;
    }
  }

  scrollToTop() {
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        let delta = currentScroll / 16;

        if (delta < 0.5) {
          delta = currentScroll;
        }

        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - delta);
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

  installApplication() {
      this.promptEvent.prompt();
  }
}
