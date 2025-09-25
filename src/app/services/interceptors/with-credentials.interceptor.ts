import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHandlerFn, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';


  export function withCredentialsHttpInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    //const token = this.aa.token;
    //if (this.aa.principal.getValue()?.loggedIn) {
      request = request.clone({ withCredentials: true });
    //}
    return next(request);
  }

