import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  readonly API_URL = environment.api.url;

  apiUrlFromPath(path: string): string {
    return this.API_URL + path;
  }
}
