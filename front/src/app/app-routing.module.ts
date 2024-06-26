import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {IsConnectedGuard} from './guards/is-connected-guard.service';
import {IsDisconnectedGuard} from './guards/is-disconnected-guard.service';


const routes: Routes = [
  {
    path:             'series',
    data:             {
      animation: 'connected'
    },
    loadChildren:     () => import('./modules/core/core.module').then(m => m.CoreModule),
  },
  {
    path:         'users',
    data:         {
      animation: 'disconnected'
    },
    loadChildren: () => import('./modules/minimal/minimal.module').then(m => m.MinimalModule),
  },
  {
    path:        '',
    pathMatch:   'full',
    redirectTo:  'series/search'
  },
];

@NgModule(
  {
    providers: [IsConnectedGuard, IsDisconnectedGuard],
    imports:   [RouterModule.forRoot(routes)],
    exports:   [RouterModule]
  }
)
export class AppRoutingModule {
}
