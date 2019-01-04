import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-assets-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  displayFilterMenu: boolean = false;

  result: any[] = [];
  filters: {} = {};

  activeFilters = {
    locale: null,
    type: null,
  };

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.searchService.search().subscribe(data => {
      this.result = data['assets'];
      this.filters = data['filters'];
    });
  }

  toogleFilterMenu() {
    this.displayFilterMenu = !this.displayFilterMenu;
  }

  onSearchChange(event) {
    let query = event.target.value;

    if ('' === query) {
      query = null;
    }

    this.searchService.search(query).subscribe(data => {
      this.result = data['assets'];
      this.filters = data['filters'];
    });
  }

  clearActiveFilters(): void {
    this.activeFilters.locale = null;
    this.activeFilters.type = null;
  }
}
