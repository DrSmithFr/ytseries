import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {HttpClient} from "@angular/common/http";
import {ApiVersionModel} from "../../models/api/api-version.model";
import { UrlService } from './utils/url.service';

// contain every api call to be easily fake using angular provider mechanism
@Injectable(
  {
    providedIn: 'root'
  }
)
export class ApiService {
  constructor(
    private http: HttpClient,
    private url: UrlService,
    private user: UserService,
  ) {
  }

  public getApiVersion()  {
    return this
      .http
      .get<ApiVersionModel>(this.url.apiUrlFromPath('/v2/public/version'));
  }

  public users(): UserService {
    return this.user;
  }
}
