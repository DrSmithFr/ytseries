import {Injectable} from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
import {tap} from "rxjs/operators";
import {mediaQuery} from "../../environments/breakpoints";
import {BehaviorSubject} from "rxjs";

export enum Devices {
  smallMobile = 'smallMobile',
  largeMobile = 'largeMobile',
  tablet = 'tablet',
  desktop = 'desktop'
}

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private currentBreakpoint = mediaQuery.desktop;
  private currentDevice = new BehaviorSubject<Devices>(Devices.desktop);

  constructor(
    private breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        mediaQuery.mobileXs,
        mediaQuery.mobileXl,
        mediaQuery.tablet,
        mediaQuery.desktop,
      ])
      .pipe(
        tap(() => {
          if(breakpointObserver.isMatched(mediaQuery.mobileXs)) {
            this.currentBreakpoint = mediaQuery.mobileXs;
            this.currentDevice.next(Devices.smallMobile);
          } else if(breakpointObserver.isMatched(mediaQuery.mobileXl)) {
            this.currentBreakpoint = mediaQuery.mobileXl;
            this.currentDevice.next(Devices.largeMobile);
          } else if(breakpointObserver.isMatched(mediaQuery.tablet)) {
            this.currentBreakpoint = mediaQuery.tablet;
            this.currentDevice.next(Devices.tablet);
          } else if(breakpointObserver.isMatched(mediaQuery.desktop)) {
            this.currentBreakpoint = mediaQuery.desktop;
            this.currentDevice.next(Devices.desktop);
          }

          console.debug('Breakpoints updated:', this.currentDevice)
        })
      )
      .subscribe();
  }

  public getDevice() {
    return this.currentDevice.value;
  }

  public getDeviceSubject() {
    return this.currentDevice;
  }

  // DirectMatch

  public isSmallMobile() {
    return this.currentBreakpoint === mediaQuery.mobileXs;
  }

  public isLargeMobile() {
    return this.currentBreakpoint === mediaQuery.mobileXl;
  }

  public isTablet() {
    return this.currentBreakpoint === mediaQuery.tablet;
  }

  public isDesktop() {
    return this.currentBreakpoint === mediaQuery.desktop;
  }

  // RangeMatch

  public isMobile() {
    return this.isSmallMobile() || this.isLargeMobile();
  }

  public isMobileOrTablet() {
    return this.isMobile() || this.isTablet();
  }

  public isTabletOrDesktop() {
    return this.isTablet() || this.isDesktop();
  }
}
