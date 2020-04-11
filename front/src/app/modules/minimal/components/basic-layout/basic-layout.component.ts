import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {fadeIn, fallIn, popOut, slideIn, slideOut} from '../../../../animations/animations';
import {transition, trigger} from '@angular/animations';

@Component(
    {
        selector:    'app-basic-layout',
        templateUrl: './basic-layout.component.html',
        styleUrls:   ['./basic-layout.component.scss'],
        animations:  [
            trigger('routeAnimations', [
                transition('void => home', fallIn),

                transition('home => register', slideIn),
                transition('register => home', slideOut),

                transition('home => login', slideOut),
                transition('login => home', slideIn),
            ])
        ]
    }
)
export class BasicLayoutComponent {

    constructor() {
    }

    prepareRoute(outlet: RouterOutlet) {
        return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
    }
}
