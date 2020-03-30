import {Injectable} from '@angular/core';
import {StateService} from './state.service';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {UserModel} from '../models/user.model';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthService {

    constructor(
        private api: ApiService,
        private state: StateService
    ) {
    }

    connect(login: string, password: string): Observable<UserModel> {
        return new Observable(observer => {
            this
                .api
                .login(login, password)
                .subscribe(
                    () => {
                        this
                            .api
                            .getCurrentUser()
                            .subscribe(
                                user => observer.next(user),
                                e => observer.error(e),
                            );
                    },
                    e => observer.error(e)
                );
        });
    }

    register(email: string, password: string) {
        return this
            .api
            .register(email, password);
    }

    reconnect(): Observable<UserModel> {
        return new Observable(observer => {
            const token = this.state.TOKEN.getValue();

            if (null === token) {
                observer.complete();
            }

            this.api.reconnect(token.refresh_token).subscribe(user => {
                observer.next(user);
                observer.complete();
            });
        });
    }

    getCurrentUser(): UserModel|null {
        return this.state.LOGGED_USER.getValue();
    }

    hasSession(): boolean {
        return this.state.LOGGED_USER.getValue() !== null;
    }

    clearSession() {
        this.state.TOKEN.next(null);
        this.state.LOGGED_USER.next(null);
    }
}
