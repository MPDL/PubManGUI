import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideZoneChangeDetection,
  PLATFORM_ID,
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
  withFetch, withInterceptors,
  withInterceptorsFromDi
} from '@angular/common/http';
import { httpBlobErrorInterceptor, httpErrorInterceptor } from "./services/interceptors/http-error.interceptor";

import { provideTranslateService, TranslateLoader, TranslateService, provideTranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader, provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { isPlatformBrowser, registerLocaleData } from "@angular/common";
import { lastValueFrom } from "rxjs";
import { AaService } from "./services/aa.service";
import { provideMatomo, withRouter } from 'ngx-matomo-client';
import { environment } from "../environments/environment";
import { ContextsService } from "./services/pubman-rest-client/contexts.service";
import { MessageService } from './services/message.service';
import { provideClientHydration, withEventReplay, withHttpTransferCacheOptions } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }), withComponentInputBinding()),

    {
      provide: RouteReuseStrategy,
      useClass: PureRrs
    },

    importProvidersFrom(DialogModule),

    provideHttpClient(
      //withInterceptorsFromDi(),
      withInterceptors([httpErrorInterceptor, httpBlobErrorInterceptor]),
      //withFetch() cannot be used right now, as it does not provide Upload progress reporting: https://github.com/angular/angular/issues/53650
      withFetch()
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),

    //Use the language from ngx translate for the global LOCALE_ID
    {
      provide: LOCALE_ID,
      useFactory: (translateService: TranslateService) => {
        return translateService.currentLang},
      deps: [TranslateService],
    },

    //provide translation service by ngx-translate
    provideTranslateService(),
    provideTranslateLoader(TranslateHttpLoader),
    provideTranslateHttpLoader({
      prefix: 'assets/i18n/',
      suffix: '.json',
    }),

    provideAppInitializer(async () => {
      const translateSvc = inject(TranslateService);
      const platformId = inject(PLATFORM_ID);

      //Register german and english date formats for pipes etc.
      registerLocaleData(en)
      registerLocaleData(de);

      //Configure ngx translate
      translateSvc.addLangs(['de', 'en']);
      translateSvc.setDefaultLang('en');

      let finalLocale = translateSvc.getDefaultLang();

      if (isPlatformBrowser(platformId)) {
        //Store selected language in local storage
        translateSvc.onLangChange.subscribe(ev => {
          localStorage.setItem('locale', ev.lang);
        })

        //Set language at beginning. Use from local storage or browser
        const userLocale = localStorage.getItem('locale');
        const browserLocale = translateSvc.getBrowserLang() || 'en';

      if (userLocale) {
        finalLocale = userLocale;
      } else {
        if (browserLocale ==='de' || browserLocale==='en')
        {
          finalLocale = browserLocale;
        }
      }

      //Wait until lang is loaded, so that translateService.instant() method can be used any time
      await lastValueFrom(translateSvc.use(finalLocale as string));
    }),


    provideAppInitializer(async () => {
      const aaService = inject(AaService);
      const messageService = inject(MessageService);
      const platformId = inject(PLATFORM_ID);

      if (isPlatformBrowser(platformId)) {
        try {
          await lastValueFrom(aaService.checkLogin());
        } catch (err) {
          messageService.error("Error checking login status on app initialization: " + err);
        }
      }
    }),

    provideMatomo(
      {
        disabled: !environment.matomo_enabled,
        trackerUrl: environment.matomo_site_url,
        siteId: environment.matomo_site_id,
        //use cookieless tracking
        requireConsent: 'cookie',
        acceptDoNotTrack: true,

      },
      withRouter()
    ),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
  ],

};
