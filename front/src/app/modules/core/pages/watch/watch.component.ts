import {Component, OnDestroy, OnInit} from '@angular/core';
import YouTubePlayer from 'youtube-player';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {SeriesModel} from '../../../../models/series.model';
import {HistoricModel} from '../../../../models/historic.model';
import {EpisodeModel} from '../../../../models/episode.model';
import {ApiService} from '../../../../services/api.service';
import {AuthService} from '../../../../services/auth.service';
import {StateService} from '../../../../services/state.service';
import {MatDialog} from '@angular/material/dialog';
import {PlaylistComponent} from '../../components/playlist/playlist.component';

const HISTORIC_FREQUENCY_IN_SECOND = 3;

@Component(
  {
    selector:    'app-watch',
    templateUrl: './watch.component.html',
    styleUrls:   ['./watch.component.scss']
  }
)
export class WatchComponent implements OnInit, OnDestroy {

  series: SeriesModel                      = null;
  player: YouTubePlayer                    = null;
  historic: HistoricModel                  = null;
  userConnectionSubscription: Subscription = null;
  currentEpisode: EpisodeModel             = null;

  currentTimeCheckInterval = null;
  timeInterval: number;

  blurry = false;

  countDownActive   = false;
  countDown         = 3;
  countDownInterval = null;

  video = {
    code:        null,
    currentTime: null,
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private state: StateService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;

    this
      .api
      .getSeriesByCode(id)
      .subscribe((data: SeriesModel) => {
        this.series = data;

        const user = this.state.LOGGED_USER.getValue();

        if (user && !this.isMovie()) {
          this
            .api
            .getHistoricOfSeries(this.series.import_code)
            .subscribe(
              historic => {
                const playlist = [];

                for (const season of this.series.seasons) {
                  for (const e of season.episodes) {
                    playlist.push(e);
                  }
                }

                const episode = playlist.filter(ep => {
                  return ep.id === historic.episode_id;
                });

                if (episode.length) {
                  this.loadEpisode(episode[0], true);
                  this.historic = historic;
                }
              },
              () => {
                this.loadEpisode(data.seasons[0].episodes[0], true);
              }
            );
        } else {
          this.loadEpisode(data.seasons[0].episodes[0], true);
        }
      });

    this.player = YouTubePlayer(
      'yt-video-player',
      {
        controls: 0,
        ref:      0
      }
    );

    this.player.on('stateChange', (e) => this.onPlayerStateChange(e));
  }

  ngOnDestroy(): void {
    if (this.currentTimeCheckInterval) {
      clearInterval(this.currentTimeCheckInterval);
    }

    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
    }

    if (this.userConnectionSubscription) {
      this.userConnectionSubscription.unsubscribe();
    }
  }

  onPlayerStateChange(e) {
    const state = e.data;

    switch (state) {
      case 1: // playing
        if (this.historic) {
          this.player.seekTo(this.historic.time_code, true);
          this.historic = null;
        }

        this.startDuractionChecker();
        break;
      case -1: // not started
      // falls through
      case 0: // ended
        this.videoAutoSwitch();
      // falls through
      case 2: // pause
      // falls through
      case 3: // buffering
        this.stopTimeChecker();
        break;
      case 5: // video cued
        break;
    }
  }

  loadHistoric() {
    this
      .api
      .getHistoricOfSeries(this.series.import_code)
      .subscribe(historic => {
        const playlist = [];
        for (const season of this.series.seasons) {
          for (const e of season.episodes) {
            playlist.push(e);
          }
        }

        const episode = playlist.filter(ep => {
          return ep.id === historic.episode_id;
        });

        if (episode.length) {
          this.loadEpisode(episode[0]);
          this.historic = historic;
        }
      });
  }

  saveHistoric(): void {
    if (this.auth.getCurrentUser() === null) {
      return;
    }

    this
      .api
      .saveHistoricOfSeries(
        this.series.import_code,
        this.currentEpisode.id,
        this.video.currentTime
      )
      .subscribe(() => {
      });
  }

  checkTime() {
    const time = performance.now();

    this.video.currentTime += Math.round((time - this.timeInterval) / 1000);
    this.saveHistoric();

    this.timeInterval = time;
  }

  startDuractionChecker() {
    this.timeInterval = performance.now();

    this.player.getCurrentTime().then((e) => {
      this.video.currentTime = Math.round(e);
    });

    this.currentTimeCheckInterval = setInterval(() => {
      this.checkTime();
    }, HISTORIC_FREQUENCY_IN_SECOND * 1000);
  }

  stopTimeChecker() {
    clearInterval(this.currentTimeCheckInterval);
  }

  loadEpisode(episode: EpisodeModel | null, autoPlay: boolean = false): void {
    if (episode === null) {
      this.player.stopVideo();
      return;
    }

    this.currentEpisode    = episode;
    this.video.code        = episode.code;
    this.video.currentTime = 0;

    this.player.loadVideoById(episode.code);

    if (autoPlay) {
      this.player.playVideo();
    } else {
      this.player.stopVideo();
    }
  }

  loadNextEpisode(): void {
    const next = this.getNextEpisode(this.currentEpisode);
    this.loadEpisode(next, true);
  }

  canShowNextEpisodeButton(): boolean {
    if (null !== this.countDownInterval) {
      return true;
    }

    if (this.video.currentTime > (this.currentEpisode.duration - 30)) {
      if (null !== this.getNextEpisode(this.currentEpisode)) {
        return true;
      }
    }

    return false;
  }

  getNextEpisode(episode: EpisodeModel): EpisodeModel | null {
    if (null === this.series) {
      return null;
    }

    const playlist = [];
    for (const season of this.series.seasons) {
      for (const e of season.episodes) {
        playlist.push(e);
      }
    }

    const index = playlist.indexOf(episode);
    return playlist[index + 1] || null;
  }

  videoAutoSwitch(): void {
    const next = this.getNextEpisode(this.currentEpisode);

    if (null === next) {
      return;
    }

    if (this.video.currentTime === 0) {
      return;
    }

    this.countDown         = 3;
    this.countDownActive   = true;
    this.countDownInterval = setInterval(() => {
      this.countDown--;

      if (this.countDown === 0) {
        this.loadEpisode(next, true);
        this.countDownActive = false;
        clearInterval(this.countDownInterval);
      }
    }, 1000);
  }

  getSeasonName(episode: EpisodeModel): string {
    if (null === this.series) {
      return '';
    }

    for (const season of this.series.seasons) {
      if (-1 !== season.episodes.indexOf(episode)) {
        return season.name;
      }
    }

    return '';
  }

  isMovie(): boolean {
    if (null === this.series) {
      return false;
    }

    const playlist = [];
    for (const season of this.series.seasons) {
      for (const e of season.episodes) {
        playlist.push(e);
      }
    }

    return 1 === playlist.length;
  }

  pause() {
    this.player.pauseVideo();
  }

  play() {
    this.player.playVideo();
  }

  openPlaylist() {
    this.blurry = true;
    this.pause();

    this
      .dialog
      .open(
        PlaylistComponent,
        {
          maxWidth: '800px',
          minWidth: '300px',
          data:     {
            series: this.series,
            video: this.currentEpisode
          }
        }
      )
      .afterClosed()
      .subscribe((episode: EpisodeModel) => {
        this.blurry = false;

        if (episode === undefined || episode === this.currentEpisode) {
          this.play();
        } else {
          this.loadEpisode(episode, true);
        }
      });
  }
}
