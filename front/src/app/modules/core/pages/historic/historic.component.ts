import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component(
    {
        selector:    'app-historic',
        templateUrl: './historic.component.html',
        styleUrls:   ['./historic.component.scss']
    }
)
export class HistoricComponent implements OnInit {

    result: any[] = [];

    constructor(
        private api: ApiService
    ) {
    }

    ngOnInit() {
        this
            .api
            .getSeriesWatched()
            .subscribe(result => {
                this.result = result;
            });
    }

}
