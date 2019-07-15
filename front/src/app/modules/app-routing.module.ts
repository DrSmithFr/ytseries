import {NgModule}             from '@angular/core';
import {AuthGuard}            from './guards/auth.guard';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent}          from '../pages/login/login.component';
import {PasswordResetComponent}  from '../pages/password-reset/password-reset.component';
import {PasswordForgotComponent} from '../pages/password-forgot/password-forgot.component';
import {Page404Component}        from '../pages/page404/page404.component';
import {SearchComponent}         from '../pages/search/search.component';
import {WatchComponent}          from '../pages/watch/watch.component';
import {HistoricComponent}       from '../pages/historic/historic.component';
import {RegisterComponent}       from '../pages/register/register.component';
import {ManageComponent}         from '../pages/manage/manage.component';
import {SeriesComponent}         from '../pages/series/series.component';

const ROUTES: Routes = [
  {path: 'search', component: SearchComponent},
  {path: 'manage', component: ManageComponent},
  {path: 'edit/:code', component: SeriesComponent},
  {path: 'watch/:id', component: WatchComponent},
  {path: 'historic', component: HistoricComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'password_forgot', component: PasswordForgotComponent},
  {path: 'password_reset', component: PasswordResetComponent},
  {path: '404', component: Page404Component},

  {path: '', redirectTo: 'search', pathMatch: 'full'},
  {path: '**', redirectTo: '404'}
];

@NgModule(
  {
    imports:   [RouterModule.forRoot(ROUTES)],
    exports:   [RouterModule],
    providers: [
      AuthGuard
    ]
  }
)
export class AppRoutingModule {
}
