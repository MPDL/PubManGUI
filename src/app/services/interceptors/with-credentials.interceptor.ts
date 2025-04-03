import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AaService } from '../aa.service';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {

  constructor(
    //private aa: AaService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //const token = this.aa.token;
    //if (this.aa.principal.getValue()?.loggedIn) {
      request = request.clone({ withCredentials: true });
    //}
    return next.handle(request);
  }
}
