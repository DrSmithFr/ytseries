import { afterNextRender, Component, ElementRef, HostListener, Inject, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SeriesModel } from '../../models/movies/series.model';
import { PlayerPreview } from '../../components/player-preview/player-preview';
import { MatTooltipModule } from '@angular/material/tooltip';
import { breakpoint } from '../../../environments/breakpoints';

export type PopOverData = {
  movie: SeriesModel,
  target: HTMLElement
}

@Component(
  {
    selector: 'app-pop-over-preview',
    imports: [
      MatDialogModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      PlayerPreview
    ],
    templateUrl: './movie-preview.html',
    standalone: true,
    styleUrl: './movie-preview.scss'
  }
)
export class MoviePreview {
  movie: SeriesModel;
  content = viewChild.required<ElementRef<HTMLElement>>('content')

  CLAMP_SCREEN_MARGIN_PX = 20

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopOverData,
    public dialogRef: MatDialogRef<MoviePreview>,
  ) {
    this.movie = data.movie

    afterNextRender(() => {
      dialogRef.updateSize(`${this.computerDisplayWidthPx()}px`, `${this.computerDisplayHeightPx()}px`)
      setTimeout(() => {
        const pos = this.computerDisplayPosition(data.target)
        dialogRef.updatePosition(
          {
            left: `${pos.X}px`,
            top: `${pos.Y}px`,
          }
        )
      }, 10)


    })
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.dialogRef.close()
  }

  private computerDisplayWidthPx(): number {
    if (window.innerWidth < breakpoint.mobile) {
      return 300
    } else if (window.innerWidth < breakpoint.tablet) {
      return 500
    } else if (window.innerWidth < breakpoint.desktop) {
      return 500
    } else {
      return 600
    }
  }

  private computerDisplayHeightPx(): number {
    if (window.innerWidth < breakpoint.mobile) {
      return 450
    } else if (window.innerWidth < breakpoint.tablet) {
      return 450
    } else if (window.innerWidth < breakpoint.desktop) {
      return 450
    } else {
      return 450
    }
  }

  private computerDisplayPosition(target: HTMLElement): { X: number, Y: number } {
    const rect = target.getBoundingClientRect()

    let centerX = rect.left + rect.width / 2
    let centerY = rect.top + rect.height / 2

    // taille popover
    // const popRect = popover.getBoundingClientRect()
    const popRect = {
      width: this.computerDisplayWidthPx(),
      height: this.computerDisplayHeightPx(),
    }

    centerX = centerX - popRect.width / 2
    centerY = centerY - popRect.height / 2

    const margin = this.CLAMP_SCREEN_MARGIN_PX

    // clamp pour rester dans l'écran
    const maxX = window.innerWidth - popRect.width - margin
    const maxY = window.innerHeight - popRect.height - margin

    const clampedX = Math.min(Math.max(centerX, margin), maxX)
    const clampedY = Math.min(Math.max(centerY, margin), maxY)

    return {
      X: clampedX,
      Y: clampedY,
    }
  }
}
