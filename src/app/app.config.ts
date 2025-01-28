import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ApiModule, Configuration} from './openapi-client';
import {authorizationInterceptor} from './interceptors/authorization.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authorizationInterceptor])
    ),
    importProvidersFrom(
      ApiModule.forRoot(() => {
        return new Configuration({
          basePath: 'https://294.cyrotech.ch'
        });
      })
    )
  ]
};
