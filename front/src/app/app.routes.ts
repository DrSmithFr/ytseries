import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth.guard';
import { Register } from './pages/register/register';
import { Homepage } from './pages/homepage/homepage';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [AuthGuard.isConnected(false, '/admin/dashboard')],
  },
  {
    path: 'signup',
    component: Register,
    canActivate: [AuthGuard.isConnected(false, '/admin/dashboard')],
  },
  {
    path: '',
    pathMatch: 'full',
    component: Homepage,
  },
  {
    path: '**',
    pathMatch: 'full',
    component: NotFound,
    data: {
      animation: '404'
    }
  },
];
