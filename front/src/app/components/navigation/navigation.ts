import { afterNextRender, Component, HostListener, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component(
  {
    selector: 'app-navigation',
    imports: [
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatButtonModule,
      MatMenuModule
    ],
    templateUrl: './navigation.html',
    standalone: true,
    styleUrl: './navigation.scss'
  }
)
export class Navigation {
  isOpaque = signal<boolean>(false)

  constructor() {
    afterNextRender(() => {
      this.isOpaque.set(this.isPageScrolled() || !this.isPageScrollable());
    })
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isOpaque.set(this.isPageScrolled() || !this.isPageScrollable());
  }

  isPageScrollable(): boolean {
    return document.documentElement.scrollHeight > window.innerHeight;
  }

  isPageScrolled(): boolean {
    return window.scrollY > 0;
  }
}
