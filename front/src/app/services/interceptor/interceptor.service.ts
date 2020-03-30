import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {tap, timeout} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {StateService} from '../state.service';
import {MatSnackBar} from '@angular/material/snack-bar';


const TIME_OUT_DELAY_DEFAULT = 12000;

// handle API calls security token injection
// handle session expiration (cleared when getting 401) sending back use to login page
@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(
        private router: Router,
        private authService: AuthService,
        private stateService: StateService,
        private readonly snackBar: MatSnackBar,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.stateService.TOKEN.getValue();

        if (request.headers.get('Authorization') === null && null !== token && null !== token.token) {
            request = request.clone(
                {
                    setHeaders: {Authorization: `Bearer ${token.token}`},
                }
            );
        }

        return next
            .handle(request)
            .pipe(
                timeout(TIME_OUT_DELAY_DEFAULT),
                tap(
                    () => {
                    },
                    err => {
                        if (err instanceof HttpErrorResponse && err.status === 401 && this.authService.hasSession()) {
                            this.authService.clearSession();

                            this
                                .snackBar
                                .open(
                                    'La sessions à expirer',
                                    'OK',
                                    {
                                        horizontalPosition: 'center',
                                        verticalPosition:   'bottom',
                                        duration:           0,
                                    }
                                );

                            this.router.navigate(['/users/login']);
                        }
                    },
                ),
            );
    }
}
