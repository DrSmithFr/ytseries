import {NgModule} from '@angular/core';
import {AutoFocusDirective} from './directives/auto-focus.directive';
import {LoaderComponent} from './loader/loader.component';
import {CommonModule} from '@angular/common';


@NgModule(
  {
    declarations: [
      AutoFocusDirective,
      LoaderComponent,
    ],

    imports: [
      // minimal import
      CommonModule,
    ],
    exports: [
      AutoFocusDirective,
      LoaderComponent,
    ],
  }
)
export class SharedModule {

}
