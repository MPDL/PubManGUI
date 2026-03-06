import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { REQUEST } from '@angular/core';

@Injectable()
export class ServerCookieForwardInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    let serverRequest: any;
    try {
      serverRequest = inject(REQUEST as any);
    } catch (_) {
      serverRequest = undefined;
    }

    if (!serverRequest || !serverRequest.headers) {
      return next.handle(req);
    }

    const cookie = serverRequest.headers.get('cookie') ?? serverRequest.headers.get('Cookie');
    if (!cookie) {
      return next.handle(req);
    }

    const forwarded = req.clone({ setHeaders: { Cookie: cookie } });
    return next.handle(forwarded);
  }
}
