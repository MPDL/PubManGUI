import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AaService } from '../aa.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

  constructor(
    private aa: AaService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.aa.token;
    if (token) {
      request = request.clone({ setHeaders: { 'Authorization': token } });
    }
    return next.handle(request);
  }
}
