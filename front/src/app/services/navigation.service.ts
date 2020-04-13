import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class NavigationService {

  public showNavigation: BehaviorSubject<boolean>;

  constructor() {
    this.showNavigation = new BehaviorSubject<boolean>(true);
  }

  hide() {
    this.showNavigation.next(false);
  }

  show() {
    this.showNavigation.next(true);
  }
}
