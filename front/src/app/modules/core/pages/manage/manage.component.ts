import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';

@Component(
    {
        selector:    'app-manage',
        templateUrl: './manage.component.html',
        styleUrls:   ['./manage.component.scss']
    }
)
export class ManageComponent implements OnInit {

    result: any[] = [];

    constructor(
        private api: ApiService
    ) {
    }

    ngOnInit() {
        this
            .api
            .getManagedSeries()
            .subscribe(data => {
                this.result = data;
            });
    }

}
