import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-navigation-mobile',
  templateUrl: './navigation-mobile.component.html',
  styleUrls: ['./navigation-mobile.component.scss']
})
export class NavigationMobileComponent implements OnInit {

  @Output() searching = new EventEmitter<string>();

  public opened: boolean = false;
  public query: string;

  constructor() { }

  ngOnInit() {
  }

  toggleNavigation() {
    this.opened = !this.opened;
  }

  sendQuery() {
    this.searching.emit(this.query);
  }

  clearQuery() {
    this.query = '';
    this.sendQuery();
  }
}
