import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withInMemoryScrolling, withRouterConfig, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { PureRrs } from './services/pure-rrs';
import { DialogModule } from '@angular/cdk/dialog';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideLocale, provideLocaleId } from './shared/services/i18n.service';
import { HttpErrorInterceptor } from "./services/interceptors/http-error.interceptor";
import { WithCredentialsInterceptor } from "./services/interceptors/with-credentials.interceptor";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, 'assets/i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), withComponentInputBinding()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor, multi: true
    },
    {
      provide: RouteReuseStrategy,
      useClass: PureRrs
    },
    importProvidersFrom(DialogModule),
    provideHttpClient(),
    provideLocale(),
    provideLocaleId(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })])
  ]
};
