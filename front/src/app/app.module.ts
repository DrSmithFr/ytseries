import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {ServiceWorkerModule} from '@angular/service-worker';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {InterceptorService} from './services/interceptor/interceptor.service';

@NgModule(
    {
        bootstrap:    [
            // root component of the app
            AppComponent,
        ],
        declarations: [
            AppComponent,
        ],
        imports:      [
            // routing main module
            AppRoutingModule,

            // http client for api calls
            HttpClientModule,

            // loading browser modules
            BrowserModule,
            BrowserAnimationsModule,

            // snackBar for overall notification system
            MatSnackBarModule,

            // PWA service worker (cache management)
            ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
        ],
        exports:      [
            HttpClientModule,
            BrowserModule,
            BrowserAnimationsModule,
            MatSnackBarModule
        ],
        providers:    [
            {
                provide:  MAT_SNACK_BAR_DEFAULT_OPTIONS,
                useValue: {duration: 2500}
            },
            {
                provide:  HTTP_INTERCEPTORS,
                useClass: InterceptorService,
                multi:    true
            },
        ]
    }
)

export class AppModule {
}
