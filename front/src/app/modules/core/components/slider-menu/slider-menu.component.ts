import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';

@Component(
  {
    selector:    'app-slider-menu',
    templateUrl: './slider-menu.component.html',
    styleUrls:   ['./slider-menu.component.scss']
  }
)
export class SliderMenuComponent {

  @Output() closed = new EventEmitter<true>();

  constructor(
    public auth: AuthService,
  ) {
  }

  close() {
    this.closed.emit(true);
  }
}
