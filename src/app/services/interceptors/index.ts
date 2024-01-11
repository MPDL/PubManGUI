import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthHeaderInterceptor } from './auth-header.interceptor';
import { HttpErrorInterceptor } from './http-error.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  // { provide: HTTP_INTERCEPTORS, useClass: AuthHeaderInterceptor, multi: true },
];
