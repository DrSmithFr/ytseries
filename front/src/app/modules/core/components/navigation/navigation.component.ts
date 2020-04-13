import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {NavigationService} from '../../../../services/navigation.service';

@Component(
  {
    selector:    'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls:   ['./navigation.component.scss']
  }
)
export class NavigationComponent implements AfterViewInit {

  hide = false;

  @Output() opening = new EventEmitter<true>();

  constructor(
    private router: Router,
    private navigation: NavigationService
  ) {
    this.navigation.showNavigation.subscribe(show => {
      this.hide = !show;
    });
  }

  onMenuClick() {
    this.opening.emit(true);
  }

  ngAfterViewInit(): void {
    document.body.onscroll = () => {
      this.navigation.show();
    };

    document.body.ontouchmove = () => {
      this.navigation.show();
    };

    // resetting the scrollbar after navigation
    this
      .router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.navigation.show();
      });
  }
}
