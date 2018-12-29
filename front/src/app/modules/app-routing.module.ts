import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../pages/login/login.component';
import { PasswordResetComponent } from '../pages/password-reset/password-reset.component';
import { PasswordForgotComponent } from '../pages/password-forgot/password-forgot.component';
import { Page404Component } from '../pages/page404/page404.component';
import {AssetsSearchComponent} from '../pages/assets-search/assets-search.component';

const ROUTES: Routes = [
  { path: 'search', component: AssetsSearchComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'password_forgot', component: PasswordForgotComponent },
  { path: 'password_reset', component: PasswordResetComponent },
  { path: '404', component: Page404Component, canActivate: [AuthGuard] },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', redirectTo: 'search', pathMatch: 'full' },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {
}
