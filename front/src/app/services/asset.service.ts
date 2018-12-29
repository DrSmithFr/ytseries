import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from "rxjs";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  constructor(
    private http: HttpClient
  ) {
  }

  search(query ?: string): Observable<any[]> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<any[]>(API_URL + '/open/search', {params: params});;
  }
}
