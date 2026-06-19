import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  OnDestroy,
  signal,
  viewChild
} from '@angular/core';

import YouTubePlayer from 'youtube-player';
import { YouTubePlayer as Player } from 'youtube-player/dist/types';
import PlayerStates from 'youtube-player/dist/constants/PlayerStates';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { PlayerPreviewManager } from '../../services/player-preview-manager';
import { first, from, Observable } from 'rxjs';

export type PlayerFormat = '16:9' | '16:10' | '4:3';

@Component(
  {
    selector: 'app-player-preview',
    imports: [
      NgOptimizedImage,
      NgClass,
    ],
    templateUrl: './player-preview.html',
    standalone: true,
    styleUrl: './player-preview.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
  }
)
export class PlayerPreview implements OnDestroy {
  videoId = input.required<string>();
  format  = input.required<PlayerFormat>();

  // use to hide movies black bands
  offsetPlayer = input.required<boolean>();

  startAt = input<number>(0);
  endAt   = input<number>();

  // youtube player
  playerRef        = viewChild.required<ElementRef<HTMLElement>>('playerElement');
  playerWrapperRef = viewChild.required<ElementRef<HTMLElement>>('playerWrapper');

  // signals
  player   = signal<Player | undefined>(undefined)
  playing  = signal<boolean>(false)
  finished = signal<boolean>(false)

  constructor(
    private manager: PlayerPreviewManager
  ) {
    afterNextRender(
      {
        write: () => {
          const player = YouTubePlayer(
            this.playerRef().nativeElement,
            {
              videoId: this.videoId(),
              height: '100%',
              width: '100%',
              // host: window.location.hostname,
              playerVars: {
                color: 'white',
                origin: window.origin,
                controls: 0, // disbale controls (not working?)
                disablekb: 1, // disable keyboard shortcut
                iv_load_policy: 3, // disable video annotation
                fs: 0, // no fullscreen
                enablejsapi: 1, // enable IFRAM API
                rel: 0, // disable related videos
                start: this.startAt(),
                end: this.endAt()
              },
            }
          );

          // Binding player to components events
          player.on('error', e => console.error(e));
          player.on('ready', e => this.onPlayerReady(e));
          player.on('stateChange', e => this.onPlayerStateChange(e));

          // signal player is ready in application
          this.player.set(player)
          this.manager.registerPlayer(this)
        }
      }
    )
  }

  ngOnDestroy() {
    this.manager.removePlayer(this)
    this.manager.resumeLast();
    this.player()?.destroy()
  }

  @HostListener('document:visibilitychange', ['$event'])
  onDocumentLoad(event: Event): void {
    const player    = this.player();
    const targetDom = (event.target as Document)

    if (!player || !targetDom) {
      throw new Error('YouTubePlayer is not supported in your browser');
    }

    if (targetDom.hidden) {
      player
        .pauseVideo()
        .catch(console.error)
        .then()
    } else {
      player
        .playVideo()
        .catch(console.error)
        .then()
    }
  }

  startVideo(): Observable<void> {
    const player = this.player();

    if (!player) {
      throw new Error('YouTubePlayer: Player is not defined');
    }

    this.manager.pausePlayers();
    return from(player.playVideo()).pipe(first())
  }

  pauseVideo(): Observable<void> {
    const player = this.player();

    if (!player) {
      throw new Error('YouTubePlayer: Player is not defined');
    }

    return from(player.pauseVideo()).pipe(first())
  }

  private onPlayerReady(e: CustomEvent) {
    this
      .startVideo()
      .subscribe(
        {
          next: () => {
            console.log('autoplay', this.player())
          },
          error: (err) => {
            console.error(err);
          }
        }
      )
  }

  private onPlayerStateChange(e: CustomEvent) {
    //@ts-ignore
    switch (e.data) {
      case PlayerStates.PLAYING:
        this.playing.set(true);

        setTimeout(() => {
          this.playerWrapperRef().nativeElement.classList.add('displayed');
        }, 1000);
        break;

      case PlayerStates.PAUSED:
        this.playing.set(false);

        setTimeout(() => {
          this.playerWrapperRef().nativeElement.classList.remove('displayed');
        }, 1000);

        break;
      case PlayerStates.ENDED:
        this.finished.set(true);
        this.playerWrapperRef().nativeElement.classList.remove('displayed');
        this.playing.set(false);
        break;
    }
  }

  public getRatioCssClass(ratio: PlayerFormat): string {
    switch (ratio) {
      case '16:9':
        return 'format-16-9';
      case '16:10':
        return 'format-16-10';
      case '4:3':
        return 'format-4-3';
    }
  }
}
