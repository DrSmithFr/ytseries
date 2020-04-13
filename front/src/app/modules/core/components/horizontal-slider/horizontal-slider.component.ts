import {Component, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {QuickViewComponent} from '../quick-view/quick-view.component';
import {AssetModel} from '../../../../models/search/asset.model';
import {GoogleAnalyticsService} from '../../../../services/google-analytics.service';

declare let gtag: any;

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

  // tslint:disable-next-line:variable-name
  _series: AssetModel[];
  seriesForDisplay: AssetModel[] = [];
  maxForDisplay                  = 5;

  @ViewChildren(QuickViewComponent) quickViews: QueryList<QuickViewComponent>;

  @Output() selected = new EventEmitter<AssetModel>();

  constructor(
    private ga: GoogleAnalyticsService
  ) {
  }

  onSelection(series: AssetModel) {
    this.selected.emit(series);
    this.ga.eventEmitter(
      'quickview',
      'series',
      series.name,
      'Quickview ' + series.name
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
