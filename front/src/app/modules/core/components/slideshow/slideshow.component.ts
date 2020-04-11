import {Component, Input, OnInit} from '@angular/core';
import {AssetModel} from '../../../../models/search/asset.model';

@Component(
    {
        selector:    'app-slideshow',
        templateUrl: './slideshow.component.html',
        styleUrls:   ['./slideshow.component.scss']
    }
)
export class SlideshowComponent implements OnInit {

    transform = 0;
    current: AssetModel;

    // tslint:disable-next-line:variable-name
    _series: AssetModel[];

    @Input() set series(series: AssetModel[]) {
        this._series = series.slice(0, 5);
        this.current = series[0] ?? null;
    }

    get series(): AssetModel[] {
        return this._series;
    }

    constructor() {
    }

    ngOnInit(): void {
    }

    selected(selected: AssetModel) {
        this.current = selected;
        this.updateRendering();
    }

    updateRendering() {
        const index    = this.series.indexOf(this.current);
        this.transform = 100 - (index) * 50;
    }

}
