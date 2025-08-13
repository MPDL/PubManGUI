import {
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler, HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'src/app/services/message.service';
import { AaService } from "../aa.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { LoginComponent } from "../../components/aa/login/login.component";
import { Router } from "@angular/router";


export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => []);
export const SILENT_LOGOUT = new HttpContextToken<boolean>(() => false);
export const DISPLAY_ERROR = new HttpContextToken<boolean>(() => true);

export function ignoredStatuses(statuses: number[]) {
    return new HttpContext().set(IGNORED_STATUSES, statuses);
}



@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(private message: MessageService, private aaService: AaService, private modalService: NgbModal, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const ignoredStatuses = request.context.get(IGNORED_STATUSES);
        const silentLogout = request.context.get(SILENT_LOGOUT);
        const displayError = request.context.get(DISPLAY_ERROR);
        return next.handle(request)
            .pipe(
                catchError((err: HttpErrorResponse) => {

                  //if the token in the cookie is invalid, mainly because it has expired
                  if(err.status === 401 && err.error && err.error.tokenInvalid) {
                    //The backend will have cleared the cookie here
                    //SILENT_LOGOUT is set to true only on app initialization by the who-method of the aa service, when the app is reloaded. Just repeat the request here and let the individual site handle possible request errors.

                    //Only triggered on new app initialization
                    if(silentLogout) {
                      this.message.info("Token expired/invalid -- Silent Logout!")
                      return next.handle(request);
                    }
                    //Otherwise, the app is already loaded and some user is working here. Open a dialog to login again
                    else {
                      const loginCompRef: NgbModalRef = this.modalService.open(LoginComponent, {backdrop: 'static'});
                      loginCompRef.componentInstance.forcedLogout = true;

                      return loginCompRef.dismissed.pipe(
                        switchMap((val:string, index) => {
                          console.log("DISMISS REASON" + val)
                          if(val==="login_success") {
                          }
                          else {
                            this.aaService.logout();
                          }
                          return next.handle(request);
                        })
                      )

                    }

                  }
                  else {

                    const pubmanErrorResp = new PubManHttpErrorResponse(err);
                    if (displayError && !ignoredStatuses?.includes(err.status)) {
                      const error = `${err.status} ${err.statusText}:\n${err.url}\n${pubmanErrorResp.userMessage}`
                      this.message.error(error);
                    }
                    //throw PubmanErrorResponse to handle in further catchErrors
                    return throwError(() => pubmanErrorResp);
                  }
                })
            );
    }
}

export class PubManHttpErrorResponse extends HttpErrorResponse {

  userMessage: string;
  jsonMessage: object|undefined = undefined;

  constructor(errorResponse: HttpErrorResponse) {
    super({error: errorResponse.error, headers: errorResponse.headers, status: errorResponse.status, statusText: errorResponse.statusText, url:errorResponse.url!})

    if(this.error) {
      //errors from PubMan backend are JSON objects. However, when requesting "text" in Angular HTTP client, the error is a string encoded JSON
      if(typeof this.error === 'object') {
        this.jsonMessage = this.error;
        this.userMessage = this.error.message || this.error.error || 'UNKNOWN ERROR'

      }
      else if(typeof this.error === 'string') {
        //try to parse as JSON
        try {
          const json = JSON.parse(this.error);
          //check if it's a PubMan backend error response, by checking if it has some properties
          if(json.timestamp) {
            this.jsonMessage = json;
            this.userMessage = json.message || json.error || 'UNKNOWN ERROR'
          }
          else {
            //It's any kind of string
            this.userMessage = this.error;
          }

        } catch (e) {
          this.userMessage = this.error;
        }
      }
      else {
        this.userMessage = this.message;
      }
    }
    else {
      this.userMessage = this.message;
    }

  }





}
