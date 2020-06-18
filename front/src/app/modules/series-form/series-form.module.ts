import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {EditionComponent} from './components/edition/edition.component';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
            declarations: [EditionComponent],
            imports: [
              CommonModule,
              MatCardModule,
              MatFormFieldModule,
              MatInputModule,
              FormsModule,
              MatTabsModule,
              MatSelectModule,
              MatButtonModule
            ],
            exports:      [EditionComponent]
          })
export class SeriesFormModule {
}
