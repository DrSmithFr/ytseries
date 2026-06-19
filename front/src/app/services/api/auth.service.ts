import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, Observable, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { UserModel } from '../../models/auth/user.model';
import { TokenModel } from '../../models/auth/token.model';
import { BrowserStorageService } from '../local-storage/browser-storage.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class AuthService {

  TOKEN: BehaviorSubject<TokenModel | null>;
  LOGGED_USER: BehaviorSubject<UserModel | null>;

  ROLE_HIERARCHY: Map<string, string[]> = new Map<string, string[]>(
    [
      ['ROLE_SUPER_ADMIN', ['ROLE_ADMIN']],
      ['ROLE_ADMIN', ['ROLE_USER']],
    ]
  );

  constructor(
    private api: ApiService,
    private router: Router,
    private localStorage: BrowserStorageService,
    private gtag: GoogleAnalyticsService,
  ) {
    // initializing session as empty
    this.LOGGED_USER = new BehaviorSubject<UserModel | null>(null);

    // recover token from local storage
    this.TOKEN = new BehaviorSubject<TokenModel | null>(
      this.localStorage.getObject<TokenModel>('STATE_TOKEN') || null
    );

    // saving token in local storage when updated
    this.TOKEN.subscribe((token: TokenModel | null) => {
      this.localStorage.setObject('STATE_TOKEN', token);
    });
  }

  // State management
  getUserSubject(): BehaviorSubject<UserModel | null> {
    return this.LOGGED_USER;
  }

  getTokenSubject(): BehaviorSubject<TokenModel | null> {
    return this.TOKEN;
  }

  getUser(): UserModel | null {
    return this.getUserSubject().getValue();
  }

  getToken(): TokenModel | null {
    return this.getTokenSubject().getValue();
  }

  saveUser(user: UserModel | null): void {
    console.debug('user saved', user);
    this.getUserSubject().next(user);
  }

  saveToken(token: TokenModel | null): void {
    console.debug('token saved', token);
    this.getTokenSubject().next(token);
  }

  connect(login: string, password: string, autoRedirect = true): Observable<UserModel> {
    console.time('connect: token');
    const observable = this
      .api
      .users()
      .login(login, password)

    return this.loadTokenInfo(
      observable,
      autoRedirect ? '/admin' : null,
    );
  }

  loadTokenInfo(o: Observable<TokenModel>, redirectUrl: string|null = null): Observable<UserModel> {
    const observable = o
      .pipe(
        // saving token in session
        tap(tokens => {
          console.timeEnd('connect: token');
          this.saveToken(tokens);
        }),
        // getting current user information
        concatMap(() => {
          console.time('connect: user infos');
          return this.api.users().getCurrentUser();
        }),
        // updating session with current users information
        tap(user => {
          console.timeEnd('connect: user infos');
          this.saveUser(user);
        }),
        // tracking login event
        tap(
          {
            next: (user) => {
              this
                .gtag
                .event(
                  'login',
                  {
                    event_category: 'users_login',
                    user_id: user.id,
                    user_roles: user.roles,
                    value: 'valid'
                  })
            },
            error: error => {
              this
                .gtag
                .event(
                  'login_failed',
                  {
                    event_category: 'users_login',
                    error: 'Error' + error.status,
                  })
            }
          }
        ),
      );

    if (redirectUrl !== null) {
      return observable
        .pipe(
          // redirecting after login
          tap(() => {
            console.log('redirecting after login:', redirectUrl);
            this.router.navigateByUrl(redirectUrl);
          })
        )
    }

    return observable;
  }

  reconnect(): Observable<TokenModel> {
    const token = this.getToken();

    if (null === token) {
      return throwError(() => new Error('No token found'));
    }

    console.time('reconnect')

    return this
      .api
      .users()
      .reconnect(token.refresh_token)
      .pipe(
        tap(data => {
          console.timeEnd('reconnect')
          this.saveToken(data);
        })
      )
  }

  register(
    name: string,
    email: string,
    phone: string,
    autoRedirect = true,
  ) {
    console.time('registerUser')

    const observable = this
      .api
      .users()
      .register(
        name,
        email,
        phone,
      )

    return this.loadTokenInfo(
      observable,
      autoRedirect ? '/' : null,
    );
  }

  isLogged(): boolean {
    return this.getUser() !== null && this.getToken() !== null;
  }

  disconnect() {
    console.log('clearing session');
    this.saveUser(null);
    this.saveToken(null);

    console.log('redirecting to home page');
    this.router.navigate(['']);
  }

  isGranted(...roles: string[]) {
    const user = this.getUser();

    if (!user) {
      console.warn('not logged');
      return false;
    }

    if (roles.length === 0) {
      console.warn('user roles empty', user);
      return false;
    }

    const userRoles = this.getRoles(user);

    for (const role of roles) {
      if (!userRoles.includes(role)) {
        console.warn('user not granted:', role, user)
        return false;
      }
    }

    return true;
  }

  getRoles(user: UserModel): string[] {

    const roles = [...user.roles];

    // Ensure that all users have the ROLE_USER role
    // As for Symfony, all users have the ROLE_USER set implicitly
    if (!user.roles.includes('ROLE_USER')) {
      roles.push('ROLE_USER');
    }

    for (const role of user.roles) {
      const subRoles = this.ROLE_HIERARCHY.get(role);
      if (subRoles) {
        roles.push(...subRoles);
      }
    }

    return roles;
  }

  isUser(): boolean {
    return this.isGranted('ROLE_USER');
  }

  isAdmin(): boolean {
    return this.isGranted('ROLE_ADMIN');
  }

  isSuperAdmin(): boolean {
    return this.isGranted('ROLE_SUPER_ADMIN');
  }
}
