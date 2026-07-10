import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { ServerCookieForwardInterceptor } from './services/interceptors/server-cookie.interceptor';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

class TranslateServerLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    // Production: assets are co-located in dist/browser/ relative to this server bundle
    let filePath = join(import.meta.dirname, '../browser/assets/i18n/', `${lang}.json`);
    if (!existsSync(filePath)) {
      // Development (ng serve): read directly from the source tree
      filePath = join(process.cwd(), 'src/assets/i18n/', `${lang}.json`);
    }
    return of(JSON.parse(readFileSync(filePath, 'utf8')));
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Use the fetch-based HttpClient adapter on the server so we can forward Cookie headers.
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerCookieForwardInterceptor,
      multi: true,
    },
    // Read i18n files directly from disk instead of making a loopback HTTP call on every SSR render.
    {
      provide: TranslateLoader,
      useFactory: () => new TranslateServerLoader(),
    },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
