import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';

@Component(
  {
    selector: 'app-historic',
    templateUrl: './historic.component.html',
    styleUrls: ['./historic.component.css']
  }
)
export class HistoricComponent implements OnInit {

  result: any[] = [];

  constructor(
    private searchService: SearchService
  ) {
  }

  ngOnInit() {
    this.searchService.historic().subscribe(result => {
      this.result = result;
    });
  }

}
