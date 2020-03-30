import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppLayoutComponent} from './components/app-layout/app-layout.component';
import {SearchComponent} from './pages/search/search.component';
import {ManageComponent} from './pages/manage/manage.component';
import {SeriesComponent} from './pages/series/series.component';
import {WatchComponent} from './pages/watch/watch.component';
import {HistoricComponent} from './pages/historic/historic.component';
import {IsConnectedGuard} from '../../guards/is-connected-guard.service';

const routes: Routes = [
    {
        path:      '',
        component: AppLayoutComponent,
        children:  [
            {path: 'search', component: SearchComponent},
            {path: 'manage', component: ManageComponent},
            {path: 'edit/:code', component: SeriesComponent},
            {path: 'watch/:id', component: WatchComponent},
            {path: 'historic', component: HistoricComponent, canActivate: [IsConnectedGuard]},

            {path: '', redirectTo: 'search', pathMatch: 'full'},
            {path: '**', redirectTo: '/404'}
        ]
    },
];

@NgModule(
    {
        imports: [RouterModule.forChild(routes)],
        exports: [RouterModule]
    }
)
export class CoreRoutingModule {
}
