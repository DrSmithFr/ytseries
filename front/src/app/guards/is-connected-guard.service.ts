import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {StateService} from '../services/state.service';

@Injectable()
export class IsConnectedGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthService,
    private router: Router,
    private state: StateService
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isLogged(route);
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isLogged(childRoute);
  }

  // security : forcing user to login
  // redirect user to the login page if no session is initialise
  // passing url referer as URL param
  async isLogged(route: ActivatedRouteSnapshot) {
    if (!this.auth.hasSession()) {
      this.router.navigate(['/users/login']);
      return false;
    }

    return true;
  }
}
