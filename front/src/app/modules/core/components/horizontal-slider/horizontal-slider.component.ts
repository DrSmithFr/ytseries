import {Component, Input, QueryList, ViewChildren} from '@angular/core';
import {QuickViewComponent} from '../quick-view/quick-view.component';
import {AssetModel} from '../../../../models/search/asset.model';
import {MatDialog} from '@angular/material/dialog';

@Component(
    {
        selector:    'app-horizontal-slider',
        templateUrl: './horizontal-slider.component.html',
        styleUrls:   ['./horizontal-slider.component.scss']
    }
)
export class HorizontalSliderComponent {

    @Input() title: string;
    @Input() minForDisplay = 3;

    @Input() set series(series: AssetModel[]) {
        this._series = series;
        this.updateSeriesToDisplay();
    }

    get series(): AssetModel[] {
        return this._series;
    }

    _series: AssetModel[];
    seriesForDisplay: AssetModel[] = [];
    maxForDisplay                  = 5;

    @ViewChildren(QuickViewComponent) quickViews: QueryList<QuickViewComponent>;

    constructor(
        public dialog: MatDialog
    ) {
    }

    onSelection(series: AssetModel) {
        this.dialog.open(
            QuickViewComponent,
            {
                maxWidth: '800px',
                minWidth: '300px',
                data:  series
            }
        );
    }

    updateSeriesToDisplay() {
        this.seriesForDisplay = this.series.slice(0, this.maxForDisplay);
    }

    loadMore() {
        this.maxForDisplay += 6;
        this.updateSeriesToDisplay();
    }
}
