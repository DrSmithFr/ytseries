import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { first, map, Observable } from 'rxjs';
import { UrlService } from './utils/url.service';
import { SearchResponseModel } from '../../models/search/search-response.model';
import { SeriesDto, SeriesMapper, SeriesModel } from '../../models/movies/series.model';
import { AssetModel } from '../../models/search/asset.model';
import { HistoricDto, HistoricMapper, HistoricModel } from '../../models/movies/historic.model';
import { EpisodeDto, EpisodeMapper, EpisodeModel } from '../../models/movies/episode.model';

// contain every api call to be easily fake using angular provider mechanism
@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserService {
  constructor(
    private http: HttpClient,
    private url: UrlService,
    private seriesMapper: SeriesMapper,
    private episodeMapper: EpisodeMapper,
    private historicMapper: HistoricMapper,
  ) {
  }

  searchSeries(query: string | null, activeFilter: any): Observable<SearchResponseModel> {
    let params = new HttpParams();

    if (query) {
      params = params.set('query', query);
    }

    if (activeFilter) {
      params = params.set('filters', JSON.stringify(activeFilter));
    }

    const url = this.url.apiUrlFromPath('/public/search');

    return this
      .http
      .get<SearchResponseModel>(url, {params})
  }

  getSeriesByCode(code: string): Observable<SeriesModel> {
    const url = this.url.apiUrlFromPath('/public/series/' + code);

    return this
      .http
      .get<SeriesDto>(url)
      .pipe(
        map(this.seriesMapper.fromDto),
        first()
      )
  }

  updateSeries(series: SeriesModel) {
    const url = this.url.apiUrlFromPath('/management/series');
    return this
      .http
      .patch<SeriesDto>(url, series)
      .pipe(
        map(this.seriesMapper.fromDto),
        first()
      )
  }

  getSeriesWatched(): Observable<{ continue: AssetModel[], watched: AssetModel[] }> {
    return this
      .http
      .get<{ continue: AssetModel[], watched: AssetModel[] }>(this.url.apiUrlFromPath('/historic'))
      .pipe(
        first()
      )
  }

  getHistoricOfSeries(seriesId: string): Observable<HistoricModel> {
    return this
      .http
      .get<HistoricDto>(this.url.apiUrlFromPath('/historic/' + seriesId))
      .pipe(
        first(),
        map(this.historicMapper.fromDto)
      )
  }

  saveHistoricOfSeries(seriesId: string, episodeId: number, timeCode: number): Observable<void> {
    return this
      .http
      .patch<void>(
        this.url.apiUrlFromPath('/historic/' + seriesId),
        {
          episode_id: episodeId,
          time_code: timeCode
        }
      )
      .pipe(
        first()
      )
  }

  getManagedSeries(): Observable<SeriesModel[]> {
    const url = this.url.apiUrlFromPath('/management/series');
    return this
      .http
      .get<SeriesDto[]>(url)
      .pipe(
        first(),
        map(this.seriesMapper.fromDtos)
      )
  }

  getSeriesFromPlaylist(code: string): Observable<SeriesModel[]> {
    const url = this.url.apiUrlFromPath('/management/series-form-playlist');
    return this
      .http
      .post<SeriesDto[]>(url, {playlistId: code})
      .pipe(
        first(),
        map(this.seriesMapper.fromDtos)
      )
  }

  getEpisodesFormPlaylist(code: string): Observable<EpisodeModel[]> {
    const url = this.url.apiUrlFromPath('/management/episodes-form-playlist');
    return this
      .http
      .post<EpisodeDto[]>(url, {playlistId: code})
      .pipe(
        first(),
        map(this.episodeMapper.fromDtos)
      )
  }
}
