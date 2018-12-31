import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AssetService} from "../../services/asset.service";
import {SearchService} from "../../services/search.service";

@Component({
  selector: 'app-assets-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  displayFilterMenu: boolean = false;

  result: any[] = [];

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.searchService.search().subscribe(data => {
      this.result = data;
    });
  }

  toogleFilterMenu() {
    this.displayFilterMenu = !this.displayFilterMenu;
  }

  onSearchChange(event) {
    let query = event.target.value;

    if ('' === query) {
      query = null;
    }

    this.searchService.search(query).subscribe(data => {
      this.result = data;
    });
  }
}
