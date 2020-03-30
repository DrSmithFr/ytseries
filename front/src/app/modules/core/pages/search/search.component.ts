import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {AssetModel} from '../../../../models/search/asset.model';

@Component(
    {
        selector:    'app-assets-search',
        templateUrl: './search.component.html',
        styleUrls:   ['./search.component.scss']
    }
)
export class SearchComponent implements OnInit {

    displayFilterMenu: boolean = false;

    result: AssetModel[] = [];

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

    filters: {} = {};

    query: string = '';

    activeFilters = {
        locale:     null,
        type:       null,
        categories: null,
    };

    constructor(
        private api: ApiService
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
        this.makeSearch();
    }

    toogleFilterMenu() {
        this.displayFilterMenu = !this.displayFilterMenu;
    }

    makeSearch(): void {
        this.api.searchSeries(this.query, this.activeFilters).subscribe(data => {
            this.result  = data['assets'];
            this.filters = data['filters'];

            this.recent = this.getRecent(this.result);

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

    onFiltersChange(): void {
        this.makeSearch();
    }

    clearActiveFilters(): void {
        this.activeFilters.locale     = null;
        this.activeFilters.type       = null;
        this.activeFilters.categories = null;
        this.makeSearch();
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
}
