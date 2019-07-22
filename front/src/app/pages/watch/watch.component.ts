import { Component, OnDestroy, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';
import { WatchService } from '../../services/watch.service';
import { ActivatedRoute } from '@angular/router';
import { SeriesModel } from '../../models/series.model';
import { EpisodeModel } from '../../models/episode.model';
import { UserService } from '../../services/user.service';
import { HistoricModel } from '../../models/historic.model';
import { Subscription } from 'rxjs';

const HISTORIC_FREQUENCY_IN_SECOND = 3;

@Component(
  {
    selector: 'app-watch',
    templateUrl: './watch.component.html',
    styleUrls: ['./watch.component.scss']
  }
)
export class WatchComponent implements OnInit, OnDestroy {

  series: SeriesModel   = null;
  player: YouTubePlayer = null;

  historic: HistoricModel = null;

  userConnectionSubscription: Subscription = null;

  currentEpisode: EpisodeModel = null;
  currentTimeCheckInterval     = null;
  timeInterval: number;

  countDownActive: boolean = false;
  countDown: number        = 3;
  countDownInterval        = null;

  video = {
    code: null,
    currentTime: null,
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private watchService: WatchService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params.id;

    this
      .watchService
      .seriesInformation(id)
      .subscribe((data: SeriesModel) => {
        this.series = data;
        this.loadEpisode(data.seasons[0].episodes[0]);

        if (this.userService.isConnected()) {
          this.loadHistoric();
        } else {
          this.userConnectionSubscription = this.userService.userConnected.subscribe(user => {
            this.loadHistoric();
          });
        }
      });

    this.player = YouTubePlayer(
      'yt-video-player'
    );

    this.player.on('ready', () => this.onPlayerReady());
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

  onPlayerReady() {
    // this.loadVideo('M7lc1UVf-VE');
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
      .watchService
      .getHistoric(this.series.import_code)
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
    if (!this.userService.isConnected()) {
      return;
    }

    this
      .watchService
      .addHistoric(this.series.import_code, this.currentEpisode.id, this.video.currentTime)
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
}
