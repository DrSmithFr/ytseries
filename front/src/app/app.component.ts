import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SwPush, SwUpdate} from '@angular/service-worker';
import {filter} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {transition, trigger} from '@angular/animations';
import {fadeIn} from './animations/animations';

@Component(
  {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.scss'],
    animations:  [
      trigger('routeAnimations', [
        transition('disconnected <=> connected', fadeIn),
      ])
    ]
  }
)
export class AppComponent implements OnInit {

  constructor(
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // resetting the scrollbar after navigation
    // due to the nested router use
    // + the fixed size of layout (to keep footer away during page transition)
    // this needed
    this
      .router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    if (environment.production) {
      // PWA look for update
      this
        .swUpdate
        .checkForUpdate()
        .then(() => {
          console.log('checking for update');
        });

      // PWA on update available
      this
        .swUpdate
        .available
        .subscribe(() => {
          this.onUpdate();
        });
    }
  }

  onUpdate() {
    // auto update application
    window.location.reload();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
