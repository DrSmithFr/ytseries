import { EventEmitter, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { TokenModel } from '../models/token.model';
import { tap } from 'rxjs/operators';

const API_URL     = environment.apiUrl;
const JWT_REFRESH = 'jwt-refresh-token';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserService {
  token: string                     = null;
  user: User                        = null;
  userConnected: EventEmitter<User> = new EventEmitter();

  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService
  ) {
  }

  getCurrentUser(): null | User {
    return this.user;
  }

  isConnected(): boolean {
    return null !== this.getCurrentUser();
  }

  register(login: string, password: string): Observable<void> {
    return this.http.post<any>(
      API_URL + '/open/register',
      {
        email: login,
        password: password
      }
    );
  }

  connect(login: string, password: string, rememberMe: boolean): Observable<User> {
    return Observable.create((observer) => {
      const request = this.http.post<TokenModel>(
        API_URL + '/api/login_check',
        {
          username: login,
          password: password
        }
      );

      request.subscribe(
        (data: TokenModel) => {
          this.token = data.token;

          if (rememberMe) {
            this.localStorage.set(JWT_REFRESH, data.refresh_token);
          } else {
            this.localStorage.remove(JWT_REFRESH);
          }

          this
            .userInformation()
            .subscribe(
              user => {
                observer.next(user);
              },
              (e) => observer.error(e)
            );
        },
        (e) => observer.error(e)
      );
    });
  }

  reconnect(): Observable<User> {
    const refreshToken = this.localStorage.get(JWT_REFRESH);

    if (null === refreshToken) {
      return Observable.create(observer => {
        observer.complete();
      });
    }

    return Observable.create((observer) => {
      const request = this.http.post<TokenModel>(
        API_URL + '/api/token_refresh',
        {
          refresh_token: refreshToken,
        }
      );

      request.subscribe(
        (data: TokenModel) => {
          this.token = data.token;
          this.localStorage.set(JWT_REFRESH, data.refresh_token);

          this
            .userInformation()
            .subscribe(
              user => {
                observer.next(user);
              },
              (e) => observer.error(e)
            );
        },
        (e) => {
          observer.error(e);
          this.localStorage.remove(JWT_REFRESH);
        }
      );
    });
  }

  canReconnect(): boolean {
    const refreshToken = this.localStorage.get(JWT_REFRESH);
    return null !== refreshToken;
  }

  clearSession() {
    this.token = null;
    this.user  = null;
  }

  disconnect() {
    this.clearSession();
    this.localStorage.remove(JWT_REFRESH);
  }

  resetPassword(password: string, token: string): Observable<any> {
    return this.http.post<any>(
      API_URL + '/api/password_reset',
      {
        token: token,
        new_password: password
      }
    );
  }

  isPasswordResetTokenValid(token: string): Observable<boolean> {
    return Observable.create(observer => {
      this
        .http
        .post<void>(
          API_URL + '/api/password_reset_token_validity',
          {token: token}
        )
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          () => {
            observer.next(false);
            observer.complete();
          }
        );
    });
  }

  requestPasswordReset(username: string): Observable<boolean> {
    return Observable.create(observer => {
      this
        .http
        .post<void>(
          API_URL + '/api/password_reset_request',
          {username: username}
        )
        .subscribe(
          () => {
            observer.next(true);
            observer.complete();
          },
          () => {
            observer.next(false);
            observer.complete();
          }
        );
    });
  }

  userInformation(): Observable<User> {
    const request = this.http.get<User>(API_URL + '/api/user_info');

    // avoid double execution of observable
    return request.pipe(
      tap(user => {
        this.userConnected.emit(user);
        this.user = user;
      })
    );
  }
}
