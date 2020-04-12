import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {AssetModel} from '../../../../models/search/asset.model';
import {QuickViewComponent} from '../../components/quick-view/quick-view.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../../../services/auth.service';
import {UserModel} from '../../../../models/user.model';

@Component(
  {
    selector:    'app-historic',
    templateUrl: './historic.component.html',
    styleUrls:   ['./historic.component.scss']
  }
)
export class HistoricComponent implements OnInit {

  continue: any[] = [];
  watched: any[]  = [];

  public blurry = false;
  public user: UserModel;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private auth: AuthService
  ) {
  }

  ngOnInit() {
    this.user = this.auth.getCurrentUser();

    this
      .api
      .getSeriesWatched()
      .subscribe(result => {
        this.continue = result.continue;
        this.watched  = result.watched;
      });
  }

  onSelection(series: AssetModel) {
    this.blurry = true;

    this
      .dialog
      .open(
        QuickViewComponent,
        {
          maxWidth: '800px',
          minWidth: '300px',
          data:     series
        }
      )
      .afterClosed()
      .subscribe(() => {
        this.blurry = false;
      });
  }
}
