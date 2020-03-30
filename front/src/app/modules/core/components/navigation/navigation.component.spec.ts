
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {

  let component: NavigationComponent;

  beforeEach(() => {
    component = new NavigationComponent();
  });

  it('fire opening event on menu click', () => {
    component.opening.subscribe(bool => {
      expect(bool).toBeTruthy();
    });

    component.onMenuClick();
  });
});
