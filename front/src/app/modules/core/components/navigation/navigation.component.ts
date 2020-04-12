import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component(
  {
    selector:    'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls:   ['./navigation.component.scss']
  }
)
export class NavigationComponent implements AfterViewInit {

  hide = false;
  private timeout;

  @Output() opening = new EventEmitter<true>();

  constructor(
    private router: Router
  ) {
  }

  onMenuClick() {
    this.opening.emit(true);
  }

  ngAfterViewInit(): void {
    this.resetInactivity();

    document.body.onscroll = () => {
      this.resetInactivity();
    };

    document.body.ontouchmove = () => {
      this.resetInactivity();
    };

    // resetting the scrollbar after navigation
    this
      .router
      .events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.resetInactivity();
      });
  }

  resetInactivity() {
    this.hide = false;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.hide = true;
    }, 10000);
  }
}
