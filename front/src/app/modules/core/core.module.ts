import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {SliderMenuComponent} from './components/slider-menu/slider-menu.component';
import {AppLayoutComponent} from './components/app-layout/app-layout.component';
import {CoreRoutingModule} from './core-routing.module';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from '../../services/interceptor/interceptor.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {HistoricComponent} from './pages/historic/historic.component';
import {ManageComponent} from './pages/manage/manage.component';
import {SearchComponent} from './pages/search/search.component';
import {SeriesComponent} from './pages/series/series.component';
import {WatchComponent} from './pages/watch/watch.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FooterComponent} from './components/footer/footer.component';
import {NavigationMobileComponent} from './components/navigation-mobile/navigation-mobile.component';
import {QuickViewComponent} from './components/quick-view/quick-view.component';
import {ScrollToTopComponent} from './components/scroll-to-top/scroll-to-top.component';
import {HorizontalSliderComponent} from './components/horizontal-slider/horizontal-slider.component';
import {SlideshowComponent} from './components/slideshow/slideshow.component';
import {MatDialogModule} from '@angular/material/dialog';
import {HeaderComponent} from './components/header/header.component';
import {PlaylistComponent} from './components/playlist/playlist.component';
import {FilterSliderMenuComponent} from './components/filter-slider-menu/filter-slider-menu.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';

@NgModule(
  {
    declarations: [
      AppLayoutComponent,
      NavigationComponent,
      SliderMenuComponent,
      HistoricComponent,
      ManageComponent,
      SearchComponent,
      SeriesComponent,
      WatchComponent,
      FooterComponent,
      NavigationMobileComponent,
      QuickViewComponent,
      HorizontalSliderComponent,
      ScrollToTopComponent,
      SlideshowComponent,
      HeaderComponent,
      PlaylistComponent,
      FilterSliderMenuComponent
    ],
    exports:      [
      AppLayoutComponent
    ],
    imports:      [
      // minimal import
      CommonModule,

      // importing reactive form
      FormsModule,
      ReactiveFormsModule,

      // loading material and shared components
      SharedModule,

      // routing
      CoreRoutingModule,
      MatSidenavModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatDividerModule,
      MatRadioModule,
      MatCardModule,
      MatInputModule,
      MatSelectModule,
      MatDialogModule,
      MatCheckboxModule,
      MatTabsModule,
      MatTableModule
    ],
    bootstrap:    [
      AppLayoutComponent
    ],
    providers:    [
      {
        provide:  HTTP_INTERCEPTORS,
        useClass: InterceptorService,
        multi:    true
      },
    ]
  }
)
export class CoreModule {
}
