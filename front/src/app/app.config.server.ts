import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { BrowserStorageService } from './services/local-storage/browser-storage.service';
import { ServerStorageService } from './services/local-storage/server-storage.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: BrowserStorageService,
      useClass: ServerStorageService
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
