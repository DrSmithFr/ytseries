import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {AssetModel}                                                    from '../../models/search/asset.model';

@Component(
  {
    selector:    'app-quick-view',
    templateUrl: './quick-view.component.html',
    styleUrls:   ['./quick-view.component.scss']
  }
)
export class QuickViewComponent {

  @Input() item: AssetModel;
  @Output() opening = new EventEmitter<QuickViewComponent>();

  @ViewChild('content') content: ElementRef;

  public displayDetail: boolean = false;

  toggleDetail() {
    this.displayDetail = !this.displayDetail;

    if (this.displayDetail){
      this.opening.emit(this);
    }
  }

  closeDetail() {
    this.displayDetail = false;
  }
}
