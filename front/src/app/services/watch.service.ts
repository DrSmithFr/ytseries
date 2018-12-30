import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../environments/environment";
import {SeriesModel} from "../models/series.model";

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  constructor(
      private http: HttpClient
  ) {
  }

  seriesInformation(id: number): Observable<SeriesModel> {
    return this.http.get<SeriesModel>(API_URL + '/open/series/' + id);
  }
}
