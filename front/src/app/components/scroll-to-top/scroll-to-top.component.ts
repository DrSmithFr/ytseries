import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT}                                from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss']
})
export class ScrollToTopComponent implements OnInit {

  windowScrolled: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.windowScrolled = false;
  }

  ngOnInit() {
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
      return;
    }

    if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
      return;
    }
  }

  scrollToTop() {
    (function smoothScroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        let delta = currentScroll / 16;

        if (delta < 0.5) {
          delta = currentScroll;
        }

        window.requestAnimationFrame(smoothScroll);
        window.scrollTo(0, currentScroll - delta);
      }
    })();
  }

}
