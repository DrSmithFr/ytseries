import {Component, EventEmitter, HostListener, Output} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';

@Component(
    {
        selector:    'app-slider-menu',
        templateUrl: './slider-menu.component.html',
        styleUrls:   ['./slider-menu.component.scss']
    }
)
export class SliderMenuComponent {

    deferredPrompt: any;
    showButton = false;

    @Output() closed = new EventEmitter<true>();

    constructor(
        public auth: AuthService,
    ) {
    }

    close() {
        this.closed.emit(true);
    }

    @HostListener('window:beforeinstallprompt', ['$event'])
    onbeforeinstallprompt(e) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();

        // Stash the event so it can be triggered later.
        this.deferredPrompt = e;
        this.showButton     = true;
    }


    installApplication() {
        // hide our user interface that shows our A2HS button
        this.showButton = false;
        // Show the prompt
        this.deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        this.deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    this.showButton     = false;
                    this.deferredPrompt = null;
                }
            });
    }
}
