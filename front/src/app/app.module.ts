import {NgModule}                                                   from '@angular/core';
import {FormsModule}                                                from '@angular/forms';
import {BrowserModule}                                              from '@angular/platform-browser';
import {ReactiveFormsModule}                                        from '@angular/forms';
import {StorageServiceModule}                                       from 'angular-webstorage-service';
import {BrowserAnimationsModule}                                    from '@angular/platform-browser/animations';
import {HttpClientModule, HTTP_INTERCEPTORS, HttpClientJsonpModule} from '@angular/common/http';

import {MatCardModule}            from '@angular/material/card';
import {MatMenuModule}            from '@angular/material/menu';
import {MatIconModule}            from '@angular/material/icon';
import {MatTabsModule}            from '@angular/material/tabs';
import {MatTreeModule}            from '@angular/material/tree';
import {MatInputModule}           from '@angular/material/input';
import {MatBadgeModule}           from '@angular/material/badge';
import {MatRadioModule}           from '@angular/material/radio';
import {MatButtonModule}          from '@angular/material/button';
import {MatToolbarModule}         from '@angular/material/toolbar';
import {MatSidenavModule}         from '@angular/material/sidenav';
import {MatDividerModule}         from '@angular/material/divider';
import {MatCheckboxModule}        from '@angular/material/checkbox';
import {MatGridListModule}        from '@angular/material/grid-list';
import {MatSnackBarModule}        from '@angular/material/snack-bar';
import {MatFormFieldModule}       from '@angular/material/form-field';
import {MatButtonToggleModule}    from '@angular/material/button-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {UserService}             from './services/user.service';
import {AppComponent}            from './app.component';
import {LoginComponent}          from './pages/login/login.component';
import {AppRoutingModule}        from './modules/app-routing.module';
import {HttpInterceptor}         from './interceptors/http.interceptor';
import {PasswordResetComponent}  from './pages/password-reset/password-reset.component';
import {PasswordForgotComponent} from './pages/password-forgot/password-forgot.component';
import {Page404Component}  from './pages/page404/page404.component';
import {SearchComponent}   from './pages/search/search.component';
import {WatchComponent}    from './pages/watch/watch.component';
import {HistoricComponent} from './pages/historic/historic.component';
import {RegisterComponent} from './pages/register/register.component';
import {ManageComponent}   from './pages/manage/manage.component';
import {SeriesComponent}   from './pages/series/series.component';
import {MatSelectModule}   from '@angular/material';

@NgModule(
  {
    imports: [
      FormsModule,
      BrowserModule,
      MatCardModule,
      MatMenuModule,
      MatIconModule,
      MatTabsModule,
      MatTreeModule,
      MatBadgeModule,
      MatInputModule,
      MatRadioModule,
      MatButtonModule,
      HttpClientModule,
      AppRoutingModule,
      MatSidenavModule,
      MatToolbarModule,
      MatDividerModule,
      MatCheckboxModule,
      MatGridListModule,
      MatSnackBarModule,
      MatFormFieldModule,
      ReactiveFormsModule,
      StorageServiceModule,
      MatButtonToggleModule,
      HttpClientJsonpModule,
      BrowserAnimationsModule,
      MatProgressSpinnerModule,
      MatSelectModule
    ],
    declarations: [
      AppComponent,
      LoginComponent,
      PasswordResetComponent,
      PasswordForgotComponent,
      Page404Component,
      SearchComponent,
      WatchComponent,
      HistoricComponent,
      RegisterComponent,
      ManageComponent,
      SeriesComponent
    ],
    providers:    [
      UserService,
      {
        provide:  HTTP_INTERCEPTORS,
        useClass: HttpInterceptor,
        multi:    true
      }
    ],
    bootstrap:    [AppComponent]
  }
)
export class AppModule {
}
