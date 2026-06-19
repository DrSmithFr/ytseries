import { Injectable } from '@angular/core';
import { GtagEvent, GtagPageview } from 'angular-gtag/src/interfaces';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class GoogleAnalyticsService {
  constructor(private gtag: GoogleTagManagerService,) {
  }

  event(action: string, params?: GtagEvent): void {
    console.debug('gtag event:', action, params);
    this
      .gtag
      .pushTag(
        {
          event: action,
          data: params,
        }
      );
  }

  pageview(params: GtagPageview): void {
    console.debug('gtag pageview:', params);
    this
      .gtag
      .pushTag(
        {
          event: 'pageview',
          data: params,
        }
      );
  }
}
