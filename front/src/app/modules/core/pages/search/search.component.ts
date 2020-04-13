import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {AssetModel} from '../../../../models/search/asset.model';
import {QuickViewComponent} from '../../components/quick-view/quick-view.component';
import {MatDialog} from '@angular/material/dialog';
import {HeaderComponent} from '../../components/header/header.component';
import {FiltersService} from '../../../../services/filters.service';

@Component(
  {
    selector:    'app-assets-search',
    templateUrl: './search.component.html',
    styleUrls:   ['./search.component.scss']
  }
)
export class SearchComponent implements OnInit {

  @ViewChild('headerComponent', {static: true}) private headerComponent: HeaderComponent;

  blurry            = false;

  result: AssetModel[] = [];

  heading: AssetModel;
  recent: AssetModel[] = [];

  types: {
    film: AssetModel[],
    shortFilm: AssetModel[],
    series: AssetModel[],
    documentary: AssetModel[],
  };

  categories: {
    humour: AssetModel[]
    aventure: AssetModel[]
    thriller: AssetModel[]
    drames: AssetModel[]
    scienceFiction: AssetModel[]
    rommantique: AssetModel[]
    action: AssetModel[]
    horreur: AssetModel[]
  };

  query = '';

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    public filterNav: FiltersService,
    private filterService: FiltersService
  ) {
    this.types = {
      film:        [],
      shortFilm:   [],
      series:      [],
      documentary: [],
    };

    this.categories = {
      humour:         [],
      aventure:       [],
      thriller:       [],
      drames:         [],
      scienceFiction: [],
      rommantique:    [],
      action:         [],
      horreur:        [],
    };
  }

  ngOnInit() {
    this
      .filterService
      .updated
      .subscribe(() => {
        this.makeSearch();
      });

    this.makeSearch();
  }

  makeSearch(): void {
    this
      .api
      .searchSeries(
        this.query,
        this.filterService.hasActiveFilters() ? this.filterService.activeFilters : null
      )
      .subscribe(data => {
        this.result                         = data.assets;
        this.filterService.availableFilters = data.filters;

        this.recent = this.getRecent(this.result);

        if (!this.heading && data.assets.length && this.heading !== data.assets[0]) {
          this.heading = data.assets[0];
        }

        this.types.series      = this.getByType(this.result, 'Séries');
        this.types.film        = this.getByType(this.result, 'Film');
        this.types.shortFilm   = this.getByType(this.result, 'Court métrage');
        this.types.documentary = this.getByType(this.result, 'Documentaire');

        this.categories.humour         = this.getByCategories(this.result, 'Humour');
        this.categories.aventure       = this.getByCategories(this.result, 'Aventure');
        this.categories.thriller       = this.getByCategories(this.result, 'Thriller');
        this.categories.drames         = this.getByCategories(this.result, 'Drames');
        this.categories.scienceFiction = this.getByCategories(this.result, 'Science fiction');
        this.categories.rommantique    = this.getByCategories(this.result, 'Rommantique');
        this.categories.action         = this.getByCategories(this.result, 'Action');
        this.categories.horreur        = this.getByCategories(this.result, 'Horreur');
      });
  }

  clearActiveFilters(): void {
    this.query = '';
    this.filterService.clearActiveFilters();
    this.makeSearch();
  }

  hasActiveFilters(): boolean {
    if (this.query && this.query !== '') {
      return true;
    }

    return this.filterService.hasActiveFilters();
  }

  updateQuery(query: string) {
    this.query = query;
    this.makeSearch();
  }

  getRecent(series: AssetModel[]): AssetModel[] {
    return series
      .sort((a, b) => b.import_date - a.import_date);
  }

  getByType(series: AssetModel[], type: string) {
    return series
      .filter((a) => a.type === type)
      .sort((a, b) => {
        return 0.5 - Math.random();
      });
  }

  getByCategories(series: AssetModel[], category: string) {
    return series
      .filter((a) => a.categories.includes(category))
      .sort((a, b) => {
        return 0.5 - Math.random();
      });
  }

  onSelection(series: AssetModel) {
    this.blurry = true;
    this.headerComponent.pause();

    this
      .dialog
      .open(
        QuickViewComponent,
        {
          maxWidth: '800px',
          minWidth: '300px',
          data:     series
        }
      )
      .afterClosed()
      .subscribe(() => {
        this.blurry = false;
        this.headerComponent.play();
      });
  }
}
