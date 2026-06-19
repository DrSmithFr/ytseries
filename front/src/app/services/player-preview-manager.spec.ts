import { TestBed } from '@angular/core/testing';

import { PlayerPreviewManager } from './player-preview-manager';

describe('PlayerPreviewManager', () => {
  let service: PlayerPreviewManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerPreviewManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
