import {async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {UserService} from './services/user.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let userService: UserService;

  beforeEach(async(() => {
    userService = new UserService();
    component   = new AppComponent(userService);
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
