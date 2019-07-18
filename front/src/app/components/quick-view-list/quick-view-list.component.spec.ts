import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewListComponent } from './quick-view-list.component';

describe('QuickViewListComponent', () => {
  let component: QuickViewListComponent;
  let fixture: ComponentFixture<QuickViewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickViewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
