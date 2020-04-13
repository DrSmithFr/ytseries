import {Component, OnInit, ViewChild} from '@angular/core';
import {FiltersService} from '../../../../services/filters.service';
import {MatSidenav} from '@angular/material/sidenav';

@Component(
  {
    selector:    'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls:   ['./app-layout.component.scss']
  }
)
export class AppLayoutComponent implements OnInit {
  @ViewChild('filternav', {static: true}) private filternav: MatSidenav;

  constructor(private filters: FiltersService) {
  }

  ngOnInit(): void {
    this.filters.openFilter.subscribe(() => {
      this.filternav.open();
    });
  }
}
