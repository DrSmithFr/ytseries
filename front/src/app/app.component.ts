import {Component, Inject} from '@angular/core';
import {UserService} from './services/user.service';
import {Router} from '@angular/router';
import {StorageService, LOCAL_STORAGE} from 'angular-webstorage-service';

@Component(
  {
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:   ['./app.component.css']
  }
)
export class AppComponent {
  constructor(
    private router: Router,
    private loginService: UserService,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService
  ) {
  }

  isConnected() {
    return null !== this.loginService.getCurrentUser();
  }

  logout() {
    this.loginService.disconnect();
    this.router.navigate(['/login']);
  }
}
