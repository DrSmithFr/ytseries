import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTen } from './top-ten';

describe('TopTen', () => {
  let component: TopTen;
  let fixture: ComponentFixture<TopTen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
