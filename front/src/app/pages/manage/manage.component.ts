import { Component, OnInit } from '@angular/core';
import {SeriesService}       from '../../services/series.service';

@Component(
  {
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
  }
)
export class ManageComponent implements OnInit {

  result: any[] = [];

  constructor(
    private seriesService: SeriesService
  ) {
  }

  ngOnInit() {
    this.seriesService.managed().subscribe(data => {
      this.result = data;
    });
  }

}
