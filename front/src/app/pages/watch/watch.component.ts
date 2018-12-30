import { Component, OnInit } from '@angular/core';
import YouTubePlayer from 'youtube-player';
import {WatchService} from "../../services/watch.service";
import {ActivatedRoute} from "@angular/router";
import {SeriesModel} from "../../models/series.model";

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.css']
})
export class WatchComponent implements OnInit {

  player: YouTubePlayer = null;

  currentTimeCheckInterval;

  data: SeriesModel = new SeriesModel();

  video = {
    code: null,
    currentTime: null
  };

  constructor(
      private route: ActivatedRoute,
      private watchService: WatchService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params.id;
    this.watchService.seriesInformation(id).subscribe((data) => {
      this.data = data;
    });

    this.player = YouTubePlayer(
        'yt-video-player'
    );

    this.player.on('ready', () => this.onPlayerReady());
    this.player.on('stateChange', (e) => this.onPlayerStateChange(e));
  }

  onPlayerReady() {
    this.loadVideo('M7lc1UVf-VE');
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
  }

  startDuractionChecker() {
    this.currentTimeCheckInterval = setInterval(() => {this.checkTime()}, 1000);
  }

  stopTimeChecker() {
    clearInterval(this.currentTimeCheckInterval);
  }

  loadVideo(code: string) {
    this.video.code = code;
    this.player.loadVideoById(code);
    this.player.stopVideo();
  }
}
