import {Component, Input, OnInit} from '@angular/core';
import {AssetModel}               from '../../models/search/asset.model';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styleUrls: ['./quick-view.component.css']
})
export class QuickViewComponent {

  @Input() item: AssetModel;

  public displayDetail = false;

  toggleDetail() {
    this.displayDetail = !this.displayDetail;
  }
}
