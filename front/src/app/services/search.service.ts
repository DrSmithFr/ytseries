import { Injectable }             from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment }            from '../../environments/environment';
import { Observable }             from 'rxjs';
import {SearchResponseModel}      from '../models/search/search-response.model';

const API_URL = environment.apiUrl;

@Injectable(
  {
    providedIn: 'root'
  }
)
export class SearchService {

  constructor(
    private http: HttpClient
  ) {
  }

  search(query: string | null, activeFilter: any): Observable<SearchResponseModel[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    params = params.set('filters', JSON.stringify(activeFilter));

    return this.http.get<SearchResponseModel[]>(API_URL + '/open/search', {params: params});
  }

  historic(): Observable<any[]> {
    return this.http.get<any[]>(API_URL + '/api/historic');
  }
}
