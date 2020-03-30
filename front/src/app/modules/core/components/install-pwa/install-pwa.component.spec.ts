import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallPwaComponent } from './install-app.component';

describe('InstallAppComponent', () => {
  let component: InstallPwaComponent;
  let fixture: ComponentFixture<InstallPwaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InstallPwaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallPwaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
