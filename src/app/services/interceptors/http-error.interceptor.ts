import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
import { AaService } from "../aa.service";


export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => []);

export function ignoredStatuses(statuses: number[]) {
    return new HttpContext().set(IGNORED_STATUSES, statuses);
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private message: MessageService, private aaService: AaService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const ignoredStatuses = request.context.get(IGNORED_STATUSES);
        return next.handle(request)
            .pipe(
                catchError((err: HttpErrorResponse) => {

                  if(err.status === 401 && err.error && err.error.tokenInvalid) {
                    console.log("INVALID TOKEN --- logging out");
                    this.message.warning("Login expired or invalid. You were logged out. ")
                    this.aaService.logout();
                    return throwError(() => "Token invalid");
                  }
                  else {
                    if (ignoredStatuses?.includes(err.status)) {
                      return throwError(() => err);
                    }
                    let message_string;
                    if (typeof err.error === 'object') {
                      if (err.error.message) {
                        message_string = err.error.message;
                      } else {
                        message_string = JSON.stringify(err.error, null, '\t');
                      }
                    } else if (typeof err.error === 'string') {
                      message_string = err.error;
                    }
                    const error = `${err.status} ${err.statusText}:\n${err.url}\n${message_string}`
                    this.message.error(error);
                    return throwError(() => error);
                  }




                })
            );
    }
}
