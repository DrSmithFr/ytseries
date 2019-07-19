import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AssetModel}                                        from '../../models/search/asset.model';
import {QuickViewComponent}                                from '../quick-view/quick-view.component';

@Component(
  {
    selector:    'app-quick-view-list',
    templateUrl: './quick-view-list.component.html',
    styleUrls:   ['./quick-view-list.component.css']
  }
)
export class QuickViewListComponent implements OnInit {

  @Input() series: AssetModel[];

  @ViewChildren(QuickViewComponent) quickViews: QueryList<QuickViewComponent>;

  constructor() {
  }

  ngOnInit() {
  }

  onSelection(selected: QuickViewComponent) {
    this.quickViews.forEach(item => {
      if (item !== selected) {
        item.closeDetail();
      }
    });
  }
}
