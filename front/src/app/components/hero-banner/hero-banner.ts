import { afterNextRender, Component, viewChild } from '@angular/core';
import { PlayerPreview } from '../player-preview/player-preview';

@Component(
  {
    selector: 'app-hero-banner',
    imports: [
      PlayerPreview
    ],
    templateUrl: './hero-banner.html',
    styleUrl: './hero-banner.scss',
    standalone: true,
  }
)
export class HeroBanner {
  player = viewChild.required<PlayerPreview>('player')
  startVideo(event: PointerEvent | undefined = undefined) {
    this.player().startVideo()
  }
}
