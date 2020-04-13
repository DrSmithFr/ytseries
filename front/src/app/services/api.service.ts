import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {StateService} from './state.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {TokenModel} from '../models/token.model';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {map, tap} from 'rxjs/operators';
import {SearchResponseModel} from '../models/search/search-response.model';
import {ReconnectModel} from '../models/reconnect.model';
import {MessageModel} from '../models/message.model';
import {SeriesModel} from '../models/series.model';
import {HistoricModel} from '../models/historic.model';
import {AssetModel} from '../models/search/asset.model';

// contain every api call to be easily fake using angular provider mechanism
@Injectable(
    {
        providedIn: 'root'
    }
)
export class ApiService {
    readonly API_URL = environment.url_api;

    constructor(
        protected state: StateService,
        protected http: HttpClient
    ) {
    }

    login(username: string, password: string): Observable<TokenModel> {
        return this
            .http
            .post<TokenModel>(
                this.API_URL + '/users/login',
                {username, password}
            )
            .pipe(
                tap(token => {
                    // updating session with current token
                    this.state.TOKEN.next(token);
                })
            );
    }

    getCurrentUser(): Observable<UserModel> {
        return this
            .http
            .get<UserModel>(this.API_URL + '/users/current')
            .pipe(
                tap(user => {
                    // updating session with current user information
                    this.state.LOGGED_USER.next(user);
                }),
            );
    }

    register(username: string, password: string): Observable<UserModel> {
        return this
            .http
            .post<UserModel>(
                this.API_URL + '/users/register',
                {username, password}
            )
            .pipe(
                tap(user => {
                    // updating session with current user information
                    this.state.LOGGED_USER.next(user);
                }),
            );
    }

    reconnect(token: string): Observable<UserModel> {
        return this
            .http
            .post<ReconnectModel>(
                this.API_URL + '/users/reconnect',
                {
                    refresh_token: token,
                }
            )
            .pipe(
                tap(data => {
                    this.state.TOKEN.next(data.token);
                    this.state.LOGGED_USER.next(data.user);
                })
            )
            .pipe(
                map(data => data.user)
            );
    }

    updatePassword(token: string, password: string): Observable<MessageModel> {
        return this
            .http
            .put<MessageModel>(
                this.API_URL + '/users/password',
                {password}
            );
    }

    checkAccountExist(username: string): Observable<MessageModel> {
        return this
            .http
            .post<MessageModel>(this.API_URL + '/users/available', {username});
    }

    searchSeries(query: string | null, activeFilter: any): Observable<SearchResponseModel> {
        let params = new HttpParams();

        if (query) {
            params = params.set('query', query);
        }

        if (activeFilter) {
          params = params.set('filters', JSON.stringify(activeFilter));
        }

        return this.http.get<SearchResponseModel>(this.API_URL + '/search', {params});
    }

    getSeriesByCode(code: string): Observable<SeriesModel> {
        return this.http.get<SeriesModel>(this.API_URL + '/series/' + code);
    }

    updateSeries(series: SeriesModel) {
        return this.http.patch<SeriesModel>(this.API_URL + '/series', series);
    }

    getSeriesWatched(): Observable<{continue: AssetModel[], watched: AssetModel[]}> {
        return this.http.get<{continue: AssetModel[], watched: AssetModel[]}>(this.API_URL + '/historic');
    }

    getHistoricOfSeries(seriesId: string): Observable<HistoricModel> {
        return this.http.get<HistoricModel>(this.API_URL + '/historic/' + seriesId);
    }

    saveHistoricOfSeries(seriesId: string, episodeId: number, timeCode: number): Observable<void> {
        return this.http.patch<void>(
            this.API_URL + '/historic/' + seriesId,
            {
                episode_id: episodeId,
                time_code:  timeCode
            }
        );
    }

    getManagedSeries(): Observable<any[]> {
        return this.http.get<any[]>(this.API_URL + '/series/managed');
    }
}
