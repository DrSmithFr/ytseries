import {Component, OnInit} from '@angular/core';
import {SeriesService}     from '../../services/series.service';
import {SeriesModel}       from '../../models/series.model';
import {ActivatedRoute}    from '@angular/router';
import {SeasonModel}       from '../../models/season.model';
import {EpisodeModel}      from '../../models/episode.model';

@Component(
  {
    selector:    'app-series',
    templateUrl: './series.component.html',
    styleUrls:   ['./series.component.css']
  }
)
export class SeriesComponent implements OnInit {

  series: SeriesModel = null;

  constructor(
    private route: ActivatedRoute,
    private seriesService: SeriesService
  ) {
  }

  ngOnInit() {
    const code = this.route.snapshot.params.code;

    this.seriesService.get(code).subscribe(data => {
      this.series = data;
    });
  }

  save() {
    this.seriesService.put(this.series).subscribe(data => {
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
}
