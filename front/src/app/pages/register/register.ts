import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { RegisterForm } from '../../forms/register-form/register-form';
import { Page } from '../../components/page/page';

@Component(
  {
    selector: 'app-register',
    standalone: true,
    imports: [
      RouterLink,
      MatCardModule,
      MatIconModule,
      RegisterForm,
      Page
],
    templateUrl: './register.html',
    styleUrl: './register.scss',
    encapsulation: ViewEncapsulation.None
  }
)
export class Register {
}
