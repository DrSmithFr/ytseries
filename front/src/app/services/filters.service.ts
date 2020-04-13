import {EventEmitter, Injectable} from '@angular/core';
import {FilterModel} from '../models/search/filter.model';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class FiltersService {

  public openFilter: EventEmitter<void>;
  public updated: EventEmitter<void>;

  public activeFilters: {
    locale: string;
    type: string,
    categories: string[],
  };

  public availableFilters: {
    locales: FilterModel[],
    types: FilterModel[],
    categories: FilterModel[]
  };

  constructor() {
    this.openFilter    = new EventEmitter<void>();
    this.updated       = new EventEmitter<void>();

    this.activeFilters = {
      locale:     null,
      type:       null,
      categories: null,
    };
  }

  open() {
    this.openFilter.emit();
  }

  onFilter() {
    this.updated.emit();
  }

  clearActiveFilters(): void {
    this.activeFilters.locale     = null;
    this.activeFilters.type       = null;
    this.activeFilters.categories = null;
    this.updated.emit();
  }

  hasActiveFilters(): boolean {
    let activeFilter = false;

    for (const [, value] of Object.entries(this.activeFilters)) {
      if (value) {
        activeFilter = true;
      }
    }

    return activeFilter;
  }
}
