import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';
import {WatchService} from "../../services/watch.service";
import {ActivatedRoute} from "@angular/router";
import {SeriesModel} from "../../models/series.model";
import {EpisodeModel} from "../../models/episode.model";

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  series: SeriesModel = null;
  player: YouTubePlayer = null;

  currentEpisode: EpisodeModel = null;
  currentTimeCheckInterval = null;

  video = {
    code: null,
    currentTime: null,
    duration: null
  };

  constructor(
      private route: ActivatedRoute,
      private watchService: WatchService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;

    this.watchService.seriesInformation(id).subscribe((data: SeriesModel) => {
      this.series = data;
      this.loadEpisode(data.seasons[0].episodes[0]);
    });

    this.player = YouTubePlayer(
        'yt-video-player'
    );

    this.player.on('ready', () => this.onPlayerReady());
    this.player.on('stateChange', (e) => this.onPlayerStateChange(e));
  }

  onPlayerReady() {
    // this.loadVideo('M7lc1UVf-VE');
  }

  onPlayerStateChange(e) {
    const state = e.data;
    switch (state) {
      case 1: // playing
          this.startDuractionChecker();
        break;
      case -1: // not started
      case 0: // ended
      case 2: // pause
      case 3: // buffering
          this.stopTimeChecker();
        break;
      case 5: // video cued
        break;
    }
  }

  checkTime() {
    this.player.getCurrentTime().then((e) => {
      this.video.currentTime = Math.round(e);
    });

    this.player.getDuration().then(e => {
      this.video.duration = e;
    });
  }

  startDuractionChecker() {
    this.currentTimeCheckInterval = setInterval(() => {this.checkTime()}, 1000);
  }

  stopTimeChecker() {
    clearInterval(this.currentTimeCheckInterval);
  }

  loadEpisode(episode: EpisodeModel|null, autoPlay: boolean = false): void {
    if (episode === null) {
      this.player.stopVideo();
      return;
    }

    this.currentEpisode = episode;
    this.video.code = episode.code;
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

  canShowNextEpisodeButton(): bool {
    if (this.video.currentTime > (this.video.duration - 30)) {
      if (null !== this.getNextEpisode(this.currentEpisode)) {
        return true;
      }
    }

    return false;
  }

  getNextEpisode(episode: EpisodeModel): Episode|null {
    if (null === this.series) {
      return null;
    }

    const playlist = [];
    for (const season of this.series.seasons){
      for (const e of season.episodes) {
        playlist.push(e);
      }
    }

    const index = playlist.indexOf(episode);
    return playlist[index + 1] || null;
  }
}
