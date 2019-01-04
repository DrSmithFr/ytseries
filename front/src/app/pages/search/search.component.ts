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

  query: string;

  activeFilters = {
    locale: null,
    type: null,
  };

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.makeSearch();
  }

  toogleFilterMenu() {
    this.displayFilterMenu = !this.displayFilterMenu;
  }

  makeSearch(): void {
    this.searchService.search(this.query, this.activeFilters).subscribe(data => {
      this.result = data['assets'];
      this.filters = data['filters'];
    });
  }

  onFiltersChange(): void {
    this.makeSearch();
  }

  clearActiveFilters(): void {
    this.activeFilters.locale = null;
    this.activeFilters.type = null;
    this.makeSearch();
  }

  hasActiveFilters(): boolean {
    let activeFilter = false;

    for (let [key, value] of Object.entries(this.activeFilters)) {
      if (value) {
        activeFilter = true;
      }
    }

    return activeFilter;
  }
}
