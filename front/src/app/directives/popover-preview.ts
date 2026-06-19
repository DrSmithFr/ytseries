import { Directive, ElementRef, HostListener, input } from '@angular/core';
import { SeriesModel } from '../models/movies/series.model';
import { MatDialog } from '@angular/material/dialog';
import { MoviePreview } from '../modals/movie-preview/movie-preview';

@Directive(
  {
    selector: '[PopOverPreview]',
    standalone: true,
  }
)
export class PopoverPreview {
  PopOverPreview = input.required<SeriesModel>();
  delayMs        = input<number>(600);

  private timeoutId: NodeJS.Timeout | undefined = undefined;

  constructor(
    private host: ElementRef<HTMLElement>,
    public dialog: MatDialog,
  ) {
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.timeoutId = setTimeout(() => {
      this.openPreviewModal(
        this.host.nativeElement,
        this.PopOverPreview()
      )
    }, this.delayMs());
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  openPreviewModal(target: HTMLElement, movie: SeriesModel) {
    return this
      .dialog
      .open(
        MoviePreview,
        {
          enterAnimationDuration: '300ms',
          exitAnimationDuration: '300ms',
          data: {
            movie: movie,
            target: target,
          },
        }
      )
  }
}
