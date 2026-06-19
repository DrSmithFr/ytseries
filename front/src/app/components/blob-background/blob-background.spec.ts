import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlobBackground } from './blob-background';

describe('BlobBackground', () => {
  let component: BlobBackground;
  let fixture: ComponentFixture<BlobBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlobBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlobBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
