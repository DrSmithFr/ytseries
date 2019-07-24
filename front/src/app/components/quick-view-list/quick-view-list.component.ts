import {Component, Inject, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AssetModel}                                                from '../../models/search/asset.model';
import {QuickViewComponent}                                        from '../quick-view/quick-view.component';
import {DOCUMENT}                                                  from '@angular/common';

@Component(
  {
    selector:    'app-quick-view-list',
    templateUrl: './quick-view-list.component.html',
    styleUrls:   ['./quick-view-list.component.scss']
  }
)
export class QuickViewListComponent {

  @Input() series: AssetModel[];
  @ViewChildren(QuickViewComponent) quickViews: QueryList<QuickViewComponent>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {

  }

  onSelection(selected: QuickViewComponent) {
    this.quickViews.forEach(item => {
      if (item !== selected) {
        item.closeDetail();
      }
    });

    selected.content.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
}
