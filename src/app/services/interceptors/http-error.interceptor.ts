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
import { MessageService } from 'src/app/shared/services/message.service';


export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => []);

export function ignoredStatuses(statuses: number[]) {
    return new HttpContext().set(IGNORED_STATUSES, statuses);
}

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private message: MessageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const ignoredStatuses = request.context.get(IGNORED_STATUSES);
        return next.handle(request)
            .pipe(
                catchError((err: HttpErrorResponse) => {
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
                })
            );
    }
}
