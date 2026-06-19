import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component(
  {
    selector: 'app-info',
    templateUrl: './info.html',
    standalone: true,
    imports: [
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
],
    styleUrls: ['./info.scss']
  }
)
export class Info {
  @Input() type: 'info' | 'warning' | 'error' | 'success' | 'pending' = 'info';
  @Input() icon: string | null                                        = null;

  MatIconMap: { [key: string]: string } = {
    info: 'info',
    warning: 'priority_high',
    error: 'report',
    success: 'check_circle',
    pending: 'more_horiz',
  }
}
