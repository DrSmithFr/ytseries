import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-mobile',
  templateUrl: './navigation-mobile.component.html',
  styleUrls: ['./navigation-mobile.component.scss']
})
export class NavigationMobileComponent implements OnInit {

  public opened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleNavigation() {
    this.opened = !this.opened;
  }
}
