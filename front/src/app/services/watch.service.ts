import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {environment} from "../../environments/environment";
import {SeriesModel} from "../models/series.model";
import {HistoricModel} from "../models/historic.model";

const API_URL = environment.apiUrl;

@Injectable({
              providedIn: 'root'
            })
export class WatchService {

  constructor(private http: HttpClient) {
  }

  seriesInformation(id: number): Observable<SeriesModel> {
    return this.http.get<SeriesModel>(API_URL + '/open/series/' + id);
  }

  getHistoric(seriesId: number): Observable<HistoricModel> {
    return this.http.get<HistoricModel>(API_URL + '/api/get_historic/' + seriesId);
  }

  addHistoric(seriesId: number, episodeId: number, timeCode: number): Observable<void> {
    return this.http.post<void>(
      API_URL + '/api/add_to_historic',
      {
        series_id: seriesId,
        episode_id: episodeId,
        time_code: timeCode
      }
    );
  }
}
