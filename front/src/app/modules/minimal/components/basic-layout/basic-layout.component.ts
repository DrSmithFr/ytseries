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
                transition('login => register', slideIn),
                transition('register => login', slideOut),
                transition('register => validation', fadeIn),
                transition('* => home', fallIn),
                transition('home => register', fallIn),
                transition('home => validation', fallIn),
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
