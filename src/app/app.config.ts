import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import de from '@angular/common/locales/de';
import en from '@angular/common/locales/en';

import { provideRouter, RouteReuseStrategy, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { PureRrs } from './services/pure-rrs';
import { DialogModule } from '@angular/cdk/dialog';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HttpErrorInterceptor } from "./services/interceptors/http-error.interceptor";
import { WithCredentialsInterceptor } from "./services/interceptors/with-credentials.interceptor";

import { provideTranslateService, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from "@angular/common";
import { lastValueFrom } from "rxjs";
import { AaService } from "./services/aa.service";

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, 'assets/i18n/', '.json');


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), withComponentInputBinding()),

    {
      provide: RouteReuseStrategy,
      useClass: PureRrs
    },

    importProvidersFrom(DialogModule),

    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor, multi: true
    },

    provideZoneChangeDetection({ eventCoalescing: true }),

    //Use the language from ngx translate for the global LOCALE_ID
    {
      provide: LOCALE_ID,
      useFactory: (translateService: TranslateService) => {
        return translateService.currentLang},
      deps: [TranslateService],
    },

    //provide translation service by ngx-translate
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    provideAppInitializer(async () => {
      const translateSvc = inject(TranslateService);

      //Register german and english date formats for pipes etc.
      registerLocaleData(en)
      registerLocaleData(de);

      //Configure ngx translate
      translateSvc.addLangs(['de', 'en']);
      translateSvc.setDefaultLang('en');

      //Store selected language in local storage
      translateSvc.onLangChange.subscribe(ev => {
        localStorage.setItem('locale', ev.lang);
      })

      //Set language at beginning. Use from local storage or browser
      const userLocale = localStorage.getItem('locale');
      const browserLocale = translateSvc.getBrowserLang() || 'en';

      let finalLocale = translateSvc.getDefaultLang();
      if (userLocale) {
        finalLocale = userLocale;
      } else {
        finalLocale = browserLocale;
      }

      //Wait until lang is loaded, so that translateService.instant() method can be used any time
      await lastValueFrom(translateSvc.use(finalLocale));
    }),


    provideAppInitializer(async () => {
      const aaService = inject(AaService);
      await lastValueFrom(aaService.checkLogin())
    }),
  ],

};
