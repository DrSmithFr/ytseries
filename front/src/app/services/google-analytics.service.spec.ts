import {TestBed} from '@angular/core/testing';

import {GoogleAnalyticsService} from './google-analytics.service';
import {Gtag} from "angular-gtag";

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;

  beforeEach(() => {
    const GtagMock = jasmine.createSpyObj('Gtag', ['event', 'pageview']);

    TestBed.configureTestingModule({
      providers: [
        {provide: Gtag, useValue: GtagMock},
      ]
    });
    service = TestBed.inject(GoogleAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
