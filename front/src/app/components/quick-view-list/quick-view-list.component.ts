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

    const rect = selected.content.nativeElement.getBoundingClientRect();

    const node       = rect.top + window.pageYOffset - document.documentElement.clientTop;
    const nodeHeight = selected.content.nativeElement.offsetHeight || selected.content.nativeElement.clientHeight;

    const target = node;

    console.debug('starting animate to reach ' + target);

    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const todo          = target - currentScroll;

      if (todo === 0) {
        return;
      }

      const delta = todo / 16;

      if (delta < 1 && delta > -1) {
        return;
      } else {
        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll + delta);
      }
    })();
  }
}
