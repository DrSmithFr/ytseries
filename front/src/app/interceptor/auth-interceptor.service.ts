import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UrlService } from '../services/api/utils/url.service';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// handle API calls security token injection
// handle session renewal (when getting 401)
// sending back user to login page if refresh token is not valid
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  isRefreshingToken = false;

  constructor(
    private router: Router,
    private urlService: UrlService,
    private authService: AuthService,
    private readonly snackBar: MatSnackBar,
  ) {
  }

  private debug(msg: string) {
    if (environment.debug) {
      console.log(msg);
    }
  }

  intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    const apiUrl = this.urlService.apiUrlFromPath('');

    // if not an api call, do nothing
    if (!request.url.startsWith(apiUrl)) {
      this.debug('AuthInterceptorService: Not detected as API call, do nothing')
      return next.handle(request);
    }

    // if public api call, do nothing
    if (request.url.startsWith(apiUrl + '/v2/auth')) {
      this.debug('AuthInterceptorService: Public API call detected, do nothing')
      return next.handle(request);
    }

    if (request.url.startsWith(apiUrl + '/v2/auth')) {
      this.debug('AuthInterceptorService: Authentication detected, do nothing')
      return next.handle(request);
    }

    const started = Date.now();
    let ok: string;

    this.debug('AuthInterceptorService: API call detected, adding auth headers')
    return next
      .handle(this.updateAuthHeaders(request))
      .pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 401 && this.authService.isLogged()) {
            return this.handleUnauthorized<T>(request, next);
          }

          return throwError(() => err)
        }),
        tap(
          {
            // Succeeds when there is a response; ignore other events
            next: (event) => (ok = event instanceof HttpResponse ? 'succeeded' : ''),
            // Operation failed; error is an HttpErrorResponse
            error: (_error) => (ok = 'failed')
          }
        ),
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${request.method} "${request.urlWithParams}" ${ok} in ${elapsed} ms.`;
          this.debug(msg)
        })
      );
  }

  private handleUnauthorized<T>(request: HttpRequest<T>, next: HttpHandler) {
    this.debug('AuthInterceptorService: Unauthorized detected, refreshing token')

    if (this.isRefreshingToken) {
      return next.handle(this.updateAuthHeaders(request))
    }

    this.isRefreshingToken = true;

    return this
      .authService
      .reconnect()
      .pipe(
        switchMap(() => {
          this.isRefreshingToken = false;

          return next.handle(this.updateAuthHeaders(request));
        }),
        catchError((err) => {
          this.isRefreshingToken = false;

          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.redirectToLogin();
          }

          return throwError(() => err);
        })
      );
  }

  private updateAuthHeaders<T>(request: HttpRequest<T>): HttpRequest<T> {
    const token = this.authService.getToken();

    if (null !== token && null !== token.token) {
      request = request.clone(
        {
          setHeaders: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );
    }

    return request;
  }

  private redirectToLogin(): void {
    this.authService.disconnect();

    this
      .snackBar
      .open(
        'La sessions à expirée, veuillez vous reconnecter',
        'OK',
        {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 5000,
        }
      );

    this.router.navigate(['/login']);
  }
}
