import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';

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

  constructor() {
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
