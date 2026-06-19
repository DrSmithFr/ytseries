import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should hide navigation by default', () => {
    expect(service.isNavigationVisible.getValue()).toBeFalse();
  });

  it('should dispatch navigation opening when calling .show()', (done) => {
    service.setNavigationVisibility(true);
    service.isNavigationVisible.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should dispatch navigation closing when calling .hide()', (done) => {
    service.setNavigationVisibility(false);
    service.isNavigationVisible.subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });
  });
});
