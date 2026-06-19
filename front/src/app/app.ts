import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Page } from './components/page/page';

@Component(
  {
    selector: 'app-root',
    imports: [
      RouterOutlet,
      Page
    ],
    templateUrl: './app.html',
    standalone: true,
    styleUrl: './app.scss'
  }
)
export class App {
  prepareRoute(outlet: RouterOutlet) {
    return outlet.activatedRouteData['animation'];
  }
}
