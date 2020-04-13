import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSliderMenuComponent } from './filter-slider-menu.component';

describe('FilterSliderMenuComponent', () => {
  let component: FilterSliderMenuComponent;
  let fixture: ComponentFixture<FilterSliderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSliderMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSliderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
