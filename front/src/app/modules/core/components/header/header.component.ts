import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {AssetModel} from '../../../../models/search/asset.model';
import YouTubePlayer from 'youtube-player';
import {SeriesModel} from '../../../../models/series.model';
import {ApiService} from '../../../../services/api.service';
import {EpisodeModel} from '../../../../models/episode.model';

@Component(
    {
        selector:    'app-header',
        templateUrl: './header.component.html',
        styleUrls:   ['./header.component.scss']
    }
)
export class HeaderComponent implements AfterViewInit {

    // allowing multiple player in the same page
    static instances = 0;
    public instance: number;

    @Input() asset: AssetModel;
    @Input() showDetail = true;

    @ViewChild('player', {static: true}) playerElement: ElementRef<HTMLInputElement>;

    showVideo             = false;
    showDescription       = true;
    series: SeriesModel   = null;
    player: YouTubePlayer = null;

    constructor(
        private api: ApiService
    ) {
        this.instance = HeaderComponent.instances++;
    }

    ngAfterViewInit(): void {
        this.player = YouTubePlayer(
            this.playerElement.nativeElement.id,
            {
                height:    '100%',
                width:     '100%',
                mute:      true,
                controls:  false,
                disablekb: true,
            }
        );

        this.player.on('ready', () => this.loadVideo());
        this.player.on('stateChange', (e) => this.onPlayerStateChange(e));
    }

    getPlayerId() {
        return 'yt-video-player-' + this.instance;
    }

    loadVideo(): void {

        this
            .api
            .getSeriesByCode(this.asset.id)
            .subscribe((data: SeriesModel) => {
                this.series = data;
                this.loadEpisode(data.seasons[0].episodes[0]);
            });
    }


    loadEpisode(episode: EpisodeModel): void {
        if (!this.series) {
            this.player.stopVideo();
            return;
        }

        this.player.loadVideoById(episode.code);
        this.player.playVideo();
    }

    onPlayerStateChange(e) {
        const state = e.data;

        switch (state) {
            case 1: // playing
                this.player.setVolume(0);
                setTimeout(() => {
                    this.showVideo = true;
                    setTimeout(() => this.showDescription = false, 3000);
                }, 500);
                break;
            case 0: // ended
                this.showVideo       = false;
                this.showDescription = true;
                break;
        }
    }
}
