import { Component, input } from '@angular/core';
import { SeriesModel } from '../../models/movies/series.model';
import { NgOptimizedImage } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopOverData, MoviePreview } from '../../modals/movie-preview/movie-preview';
import { PopoverPreview } from '../../directives/popover-preview';

@Component(
  {
    selector: 'app-movie-list',
    imports: [
      NgOptimizedImage,
      PopoverPreview
    ],
    templateUrl: './movie-list.html',
    standalone: true,
    styleUrl: './movie-list.scss'
  }
)
export class MovieList {
  title        = input.required<string>();
  movies       = input.required<SeriesModel[]>();
  isTopDisplay = input<boolean>(false);

  BEFORE_DISPLAY_TIME    = 300
  CLAMP_SCREEN_MARGIN_PX = 25

  constructor(
    public dialog: MatDialog,
  ) {
  }

  openPreviewModal(e: PointerEvent, movie: SeriesModel): () => void {
    const target = e.target as HTMLElement;

    if (target === null) {
      throw new Error('no target')
    }

    return () => {
      this
        .dialog
        .open(
          MoviePreview,
          {
            enterAnimationDuration: '300ms',
            exitAnimationDuration: '300ms',
            data: {
              movie: movie,
              target: target
            },
          }
        )
    }
  }
}
