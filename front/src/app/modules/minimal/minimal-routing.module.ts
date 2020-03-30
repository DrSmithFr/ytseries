import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BasicLayoutComponent} from './components/basic-layout/basic-layout.component';
import {IsDisconnectedGuard} from '../../guards/is-disconnected-guard.service';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {Page404Component} from './components/page404/page404.component';
import {HomeComponent} from './components/home/home.component';

const routes: Routes = [
  {
    path: '',
    component:  BasicLayoutComponent,
    children: [
      {
        path:        'login',
        canActivate: [IsDisconnectedGuard],
        component:   LoginComponent,
        data:        {
          animation: 'login'
        }
      },
      {
        path:        'register',
        canActivate: [IsDisconnectedGuard],
        component:   RegisterComponent,
        data:        {
          animation: 'register'
        }
      },
      {
        path:        'home',
        canActivate: [IsDisconnectedGuard],
        component:   HomeComponent,
        data:        {
          animation: 'home'
        }
      },
      {
        path: '404',
        component: Page404Component
      }
    ]
  },
];

@NgModule(
  {
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  }
)
export class MinimalRoutingModule {
}
