import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {StateService} from '../services/state.service';

@Injectable()
export class IsValidatedGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthService,
    private router: Router,
    private state: StateService
  ) {
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isUserValidate();
  }

  async canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.isUserValidate();
  }

  // security : forcing user to login and validate
  // redirect user to the login page if no session is initialise
  // passing url referer as URL param
  async isUserValidate() {
    const user = this.state.LOGGED_USER.getValue();

    if (user === null) {
      this.router.navigate(['/users/login']);
      return false;
    }

    return true;
  }
}
