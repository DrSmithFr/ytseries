import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../services/api.service';
import {SeriesModel} from '../../../../models/series.model';
import {SeasonModel} from '../../../../models/season.model';
import {EpisodeModel} from '../../../../models/episode.model';

@Component(
  {
    selector:    'app-series',
    templateUrl: './series.component.html',
    styleUrls:   ['./series.component.scss']
  }
)
export class SeriesComponent implements OnInit {

  series: SeriesModel = null;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    const code = this.route.snapshot.params.code;

    this
      .api
      .getSeriesByCode(code)
      .subscribe(data => {
        this.series = data;
      });
  }

  save() {
    this
      .api
      .updateSeries(this.series)
      .subscribe(data => {
        console.log(data);
      });
  }

  addSeason() {
    if (this.series) {
        this.series.seasons.push(new SeasonModel());
    }
  }

  addEpisode(season: SeasonModel) {
    if (season.episodes === undefined) {
      season.episodes = [];
    }

    season.episodes.push(new EpisodeModel());
  }

  reverseEpisodes(season: SeasonModel) {
    season.episodes = season.episodes.reverse();
  }

  ImportEpisodesFromPlaylist(season: SeasonModel) {
    this
      .api
      .getEpisodesFormPlaylist('PLX0ZsrQ2Qh5lmpwhB2tqiCsRDoVj6yli1')
      .subscribe(eps => {
        season.episodes.push(...eps);
      });
  }

  ImportSeasonFromPlaylist() {
    this
      .api
      .getEpisodesFormPlaylist('PLX0ZsrQ2Qh5lmpwhB2tqiCsRDoVj6yli1')
      .subscribe(eps => {
        const index  = this.series.seasons.length + 1;
        const season = new SeasonModel();

        season.name     = 'Season ' + index;
        season.rank     = index;
        season.episodes = eps;

        this.series.seasons.push(season);
      });
  }
}
