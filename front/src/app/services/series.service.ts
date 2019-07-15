import { Injectable }             from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment }            from '../../environments/environment';
import { Observable }             from 'rxjs';
import {SeriesModel}              from '../models/series.model';

const API_URL = environment.apiUrl;

@Injectable(
  {
    providedIn: 'root'
  }
)
export class SeriesService {

  constructor(
    private http: HttpClient
  ) {
  }

  managed(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/api/series/managed');
  }

  get(code: string): Observable<SeriesModel> {
    return this.http.get<SeriesModel>(API_URL + '/open/series/' + code);
  }

  put(series: SeriesModel) {
    return this.http.patch<SeriesModel>(API_URL + '/api/series', series);
  }
}
