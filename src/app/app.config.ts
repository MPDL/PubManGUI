import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withInMemoryScrolling, withRouterConfig, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { PureRrs } from './services/pure-rrs';
import { DialogModule } from '@angular/cdk/dialog';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { provideLocale, provideLocaleId } from './shared/services/i18n.service';
import {HttpErrorInterceptor} from "./services/interceptors/http-error.interceptor";
import {WithCredentialsInterceptor} from "./services/interceptors/with-credentials.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration: 'enabled'}), withComponentInputBinding()),
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    },

    { provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor, multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: PureRrs
    },
    importProvidersFrom(DialogModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideLocale(),
    provideLocaleId()
  ]
};
