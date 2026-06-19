import { Component, OnDestroy, Renderer2 } from '@angular/core';


@Component(
  {
    selector: 'app-overlay',
    templateUrl: './overlay.html',
    standalone: true,
    imports: [],
    styleUrls: ['./overlay.scss']
  }
)
export class Overlay implements OnDestroy {
  constructor(private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'modal-open');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'modal-open');
  }
}
