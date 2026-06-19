import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LoginForm } from '../../forms/login-form/login-form';
import { Page } from '../../components/page/page';

@Component(
  {
    selector: 'app-login',
    standalone: true,
    imports: [
      RouterLink,
      MatCardModule,
      LoginForm,
      Page
    ],
    templateUrl: './login.html',
    styleUrl: './login.scss',
    encapsulation: ViewEncapsulation.None
  }
)
export class Login {

}
