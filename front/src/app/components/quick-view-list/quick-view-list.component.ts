import {Component, Input, OnInit} from '@angular/core';
import {AssetModel}               from '../../models/search/asset.model';

@Component({
  selector: 'app-quick-view-list',
  templateUrl: './quick-view-list.component.html',
  styleUrls: ['./quick-view-list.component.css']
})
export class QuickViewListComponent implements OnInit {

  @Input() series: AssetModel[];

  constructor() { }

  ngOnInit() {
  }

}
