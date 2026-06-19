import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class NavigationService {

  public isNavigationVisible: BehaviorSubject<boolean>;

  constructor() {
    this.isNavigationVisible = new BehaviorSubject<boolean>(false);
  }

  // navigation visibility
  isNavigationVisibleSubject() {
    return this.isNavigationVisible;
  }

  setNavigationVisibility(value: boolean) {
    this.isNavigationVisibleSubject().next(value);
  }
}
