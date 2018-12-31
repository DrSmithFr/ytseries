import { TestBed, inject } from '@angular/core/testing';

import { SearchService } from './search.service';

describe('SearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetService]
    });
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
});
