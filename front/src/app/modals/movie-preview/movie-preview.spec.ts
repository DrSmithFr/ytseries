import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviePreview } from './movie-preview';

describe('PopOverPreview', () => {
  let component: MoviePreview;
  let fixture: ComponentFixture<MoviePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviePreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
