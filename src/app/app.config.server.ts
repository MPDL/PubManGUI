import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { ServerCookieForwardInterceptor } from './services/interceptors/server-cookie.interceptor';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Use the fetch-based HttpClient adapter on the server so we can forward Cookie headers.
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerCookieForwardInterceptor,
      multi: true,
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
