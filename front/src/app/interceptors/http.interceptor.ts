import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor as HttpInterceptorInterface,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class HttpInterceptor implements HttpInterceptorInterface {

  constructor(
    private auth: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (null !== this.auth.token) {
      request = request.clone(
        {
          setHeaders: {
            Authorization: `Bearer ${this.auth.token}`
          }
        }
      );
    }

    let obs = next.handle(request);

    // avoid double execution of observable
    obs = obs.pipe(
      tap(
        () => {
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.auth.clearSession();

              this.snackBar.open('Session expired', null, {duration: 1500});
              this.router.navigate(['/login'], {queryParams: {referer: this.router.url}});
            }
          }
        }
      )
    );

    return obs;
  }
}
