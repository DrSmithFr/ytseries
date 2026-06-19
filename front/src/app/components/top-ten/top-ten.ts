import { afterNextRender, Component, ElementRef, input, output, signal, viewChildren } from '@angular/core';
import { SeriesModel } from '../../models/movies/series.model';
import { NgOptimizedImage, SlicePipe } from '@angular/common';

@Component(
  {
    selector: 'app-top-ten',
    imports: [
      SlicePipe,
      NgOptimizedImage
    ],
    templateUrl: './top-ten.html',
    standalone: true,
    styleUrl: './top-ten.scss'
  }
)
export class TopTen {
  movies       = input.required<SeriesModel[]>();
  openModal = output<SeriesModel>();

  itemsList = viewChildren<ElementRef>('items')
  activeContainer = signal(1)

  private activeInterval: number | null = null
  private DEFAULT_TIMEOUT = 5000;

  constructor() {
    afterNextRender(() => {
      this.startInterval();
    })
  }

  hoverContainer() {
    this.stopInterval()
  }

  leaveContainer() {
    this.startInterval()
  }

  private startInterval() {
    if (this.activeInterval !== null) {
      return
    }

    this.activeInterval = window.setInterval(() => {
      this.clearExpanded()

      const active = this.activeContainer().valueOf();
      this.expandItem(active)

      this.activeContainer.set(active + 1)
      if (this.activeContainer() >= this.itemsList().length) {
        this.activeContainer.set(0)
      }
    }, this.DEFAULT_TIMEOUT)
  }

  private stopInterval() {
    if (this.activeInterval !== null) {
      clearInterval(this.activeInterval)
      this.activeInterval = null
    }
  }

  private clearExpanded() {
    this.itemsList().forEach(el => el.nativeElement.classList.remove('expanded'))
  }

  private expandItem(indexOrEl: number | HTMLElement) {
    if (typeof indexOrEl === 'number') {
      this.itemsList()[indexOrEl].nativeElement.classList.add('expanded')
      this.activeContainer.set(indexOrEl)
    } else {
      indexOrEl.classList.add('expanded');
      this.activeContainer.set(this.getIndexFromElement(indexOrEl))
    }
  }

  private getIndexFromElement(element: HTMLElement) {
    const items = this.itemsList()
    for (let i = 0; i < items.length; i++) {
      if (items[i].nativeElement === element) {
        return i;
      }
    }
    return 0;
  }

  clickItem(event: Event) {
    const target = event.currentTarget as HTMLElement
    this.clearExpanded()
    this.expandItem(target)
    this.stopInterval()
  }

  showDetailModal($event: PointerEvent, movie: SeriesModel) {
    $event.preventDefault()
    this.openModal.emit(movie)
  }
}
