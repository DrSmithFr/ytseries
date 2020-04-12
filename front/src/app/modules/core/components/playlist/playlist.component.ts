import {Component, Inject} from '@angular/core';
import {SeriesModel} from '../../../../models/series.model';
import {EpisodeModel} from '../../../../models/episode.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component(
  {
    selector:    'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls:   ['./playlist.component.scss']
  }
)
export class PlaylistComponent {

  series: SeriesModel;
  video: EpisodeModel;

  constructor(
    public dialogRef: MatDialogRef<PlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      series: SeriesModel,
      video: EpisodeModel,
    }
  ) {
    this.series = data.series;
    this.video  = data.video;
  }

  close() {
    this.dialogRef.close();
  }

  selectEpisode(episode: EpisodeModel) {
    this.dialogRef.close(episode);
  }
}
