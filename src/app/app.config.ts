import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { httpInterceptorProviders } from './services/interceptors';
import { PureRrs } from './services/pure-rrs';
import { DialogModule } from '@angular/cdk/dialog';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { setLocale, setLocaleId } from './services/i18n.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'enabled'})),
    httpInterceptorProviders,
    {
      provide: RouteReuseStrategy,
      useClass: PureRrs
    },
    importProvidersFrom(DialogModule),
    provideHttpClient(withInterceptorsFromDi()),
    setLocale,
    setLocaleId
  ]
};
