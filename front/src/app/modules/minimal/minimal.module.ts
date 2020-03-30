import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BasicLayoutComponent} from './components/basic-layout/basic-layout.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MinimalRoutingModule} from './minimal-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {Page404Component} from './components/page404/page404.component';
import { HomeComponent } from './components/home/home.component';


@NgModule(
  {
    declarations: [
      // app layout
      BasicLayoutComponent,

      // subRoot component when logged
      LoginComponent,
      RegisterComponent,
      Page404Component,
      HomeComponent
    ],
    imports:      [
      CommonModule,

      // routing
      MinimalRoutingModule,

      // importing reactive form
      FormsModule,
      ReactiveFormsModule,

      // minimal modules
      MatInputModule,
      MatButtonModule,
      MatProgressSpinnerModule,
      MatCheckboxModule,
      MatDialogModule,
    ],
    providers:    [
      {
        provide:  MAT_DIALOG_DEFAULT_OPTIONS,
        useValue: {
          hasBackdrop: true
        }
      }
    ]
  }
)
export class MinimalModule {
}
