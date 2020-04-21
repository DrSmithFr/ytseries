import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FiltersService} from '../../../../services/filters.service';
import {FilterModel} from '../../../../models/search/filter.model';

@Component(
  {
    selector:    'app-filter-slider-menu',
    templateUrl: './filter-slider-menu.component.html',
    styleUrls:   ['./filter-slider-menu.component.scss']
  }
)
export class FilterSliderMenuComponent implements OnInit {

  @Output() closed = new EventEmitter<true>();

  numberByLocale = new Map<string, number>();
  numberByType   = new Map<string, number>();

  constructor(
    public filters: FiltersService
  ) {
  }

  ngOnInit(): void {
  }

  updated() {
    this.filters.updated.emit();
  }

  numberOfLocale(locale: string): number {
    const local = this
      .filters
      .availableFilters
      .locales
      .filter(filter => filter.key === locale);

    if (local.length) {
      return local[0].doc_count;
    }

    return 0;
  }

  setTypeFilter(filter: FilterModel) {
    this.filters.activeFilters.type = filter.key;
    this.updated();
  }

  hasTypeFilter(filter: FilterModel): boolean {
    return this.filters.activeFilters &&
           this.filters.activeFilters.type &&
           this.filters.activeFilters.type === filter.key;
  }

  toogleCategoryFilter(filter: FilterModel) {
    let filterContainer = this.filters.activeFilters.categories;

    if (filterContainer === null) {
      filterContainer = [];
    }

    if (filterContainer.includes(filter.key)) {
      const index = filterContainer.indexOf(filter.key);
      if (index > -1) {
        filterContainer.splice(index, 1);
      }
    } else {
      filterContainer.push(filter.key);
    }

    this.filters.activeFilters.categories = filterContainer;
    this.updated();
  }

  hasCategoryFilter(filter: FilterModel): boolean {
    return this.filters.activeFilters &&
           this.filters.activeFilters.categories &&
           this.filters.activeFilters.categories.includes(filter.key);
  }

  setLocaleFilter(filter: FilterModel) {
    this.filters.activeFilters.locale = filter.key;
    this.updated();
  }

  isLocaleFilter(filter: FilterModel) {
    return this.filters.activeFilters.locale === filter.key;
  }

  getLocaleName(key: string) {
    if (key === 'fr') {
      return 'Français';
    }

    return 'English';
  }
}
