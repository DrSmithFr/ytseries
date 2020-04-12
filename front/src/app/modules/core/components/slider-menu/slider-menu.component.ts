import {Component, EventEmitter, HostListener, Inject, Output} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {SwUpdate} from '@angular/service-worker';
import {DOCUMENT} from '@angular/common';

@Component(
  {
    selector:    'app-slider-menu',
    templateUrl: './slider-menu.component.html',
    styleUrls:   ['./slider-menu.component.scss']
  }
)
export class SliderMenuComponent {

  promptEvent: any;

  @Output() closed = new EventEmitter<true>();

  constructor(
    public auth: AuthService,
    private swUpdate: SwUpdate,
    @Inject(DOCUMENT) private document: Document,
  ) {
    // install button display
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });

    // force update if needed
    swUpdate.available.subscribe(() => {
      window.location.reload();
    });
  }

  close() {
    this.closed.emit(true);
  }

  @HostListener('window:beforeinstallprompt', [])
  onWindowBeforeInstallPrompt() {

  }

  installApplication() {
    this.promptEvent.prompt();
  }
}
