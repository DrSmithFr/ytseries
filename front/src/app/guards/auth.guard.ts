import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/api/auth.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Observable } from 'rxjs';

export enum Roles {
  user        = 'ROLE_USER',
  cro         = 'ROLE_CRO',
  admin       = 'ROLE_ADMIN',
  super_admin = 'ROLE_SUPER_ADMIN'
}

@Injectable()
export class AuthGuard {

  static isConnected(state: boolean, redirectTo: string | null = null): CanActivateFn {
    return () => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return true;
      }

      const auth = inject(AuthService);

      // we are sure the user is disconnected and cannot be reconnect
      if (auth.getToken() === null) {
        return !state;
      }

      // Function to check if the user is connected
      const canActivate = (auth: AuthService, router: Router) => {
        const can = auth.isLogged() === state;

        if (!can && redirectTo !== null) {
          return router.parseUrl(redirectTo);
        }

        return can;
      }

      // we are sure the user is connected and we don't need to reconnect
      if (auth.isLogged()) {
        return canActivate(auth, inject(Router));
      }

      const router = inject(Router);

      // we have the token but not the user, we need try reconnect
      return new Observable(subscriber => {
        auth
          .loadTokenInfo(auth.reconnect(), null)
          .subscribe(
            {
              next: () => {
                subscriber.next(canActivate(auth, router));
                subscriber.complete();
              },
              error: () => {
                subscriber.next(canActivate(auth, router));
                subscriber.complete();
              }
            }
          )
      })
    };
  }

  static hasRoles(roles: Roles[], redirectTo: string | null = null): CanActivateFn {
    return () => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return true;
      }

      const can = inject(AuthService).isGranted(...roles);

      if (!can && redirectTo !== null) {
        return inject(Router).parseUrl(redirectTo);
      }

      return can;
    };
  }

  static hasOneOfRoles(roles: Roles[], redirectTo: string | null = null): CanActivateFn {
    return () => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return true;
      }

      for (const role of roles) {
        if (inject(AuthService).isGranted(role)) {
          return true;
        }
      }

      if (redirectTo !== null) {
        return inject(Router).parseUrl(redirectTo);
      }

      return false;
    };
  }

  static IsDisconnectedOrHasRoles(roles: Roles[], redirectTo: string | null = null): CanActivateFn {
    return () => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return true;
      }

      const can = !inject(AuthService).isLogged() || inject(AuthService).isGranted(...roles);

      if (!can && redirectTo !== null) {
        return inject(Router).parseUrl(redirectTo);
      }

      return can;
    };
  }

  static IsDisconnectedOrHasOneOfRoles(roles: Roles[], redirectTo: string | null = null): CanActivateFn {
    return () => {
      if (isPlatformServer(inject(PLATFORM_ID))) {
        return true;
      }

      if (!inject(AuthService).isLogged()) {
        return true;
      }

      for (const role of roles) {
        if (inject(AuthService).isGranted(role)) {
          return true;
        }
      }

      if (redirectTo !== null) {
        return inject(Router).parseUrl(redirectTo);
      }

      return false;
    };
  }
}
