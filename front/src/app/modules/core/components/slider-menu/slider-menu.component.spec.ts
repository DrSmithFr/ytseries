import {async} from '@angular/core/testing';

import {SliderMenuComponent} from './slider-menu.component';

describe('SliderMenuComponent', () => {
  let component: SliderMenuComponent;

  beforeEach(async(() => {
    component = new SliderMenuComponent();
  }));

  it('should fire closed event on close', () => {
    component.closed.subscribe(bool => {
      expect(bool).toBeTruthy();
    });

    component.close();
  });
});
