import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPreview } from './player-preview';

describe('PlayerPreview', () => {
  let component: PlayerPreview;
  let fixture: ComponentFixture<PlayerPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
