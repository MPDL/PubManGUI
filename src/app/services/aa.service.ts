import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, forkJoin, map, Observable, switchMap, tap, throwError} from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import * as props from 'src/assets/properties.json';
import {AccountUserDbVO, ContextDbVO} from "../model/inge";
import {ContextsService} from "./pubman-rest-client/contexts.service";
import {Router} from "@angular/router";


export class Principal{
  user?: AccountUserDbVO;
  loggedIn: boolean = false;
  isModerator: boolean = false;
  isDepositor: boolean = false;
  isAdmin: boolean = false;
  moderatorContexts: ContextDbVO[] = [];
  depositorContexts: ContextDbVO[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class AaService {

  static instance: AaService;

  private tokenUrl = props.inge_rest_uri.concat('/login');

  principal: BehaviorSubject<Principal>;

  constructor(
    private http: HttpClient,
    private contextService: ContextsService,
    private message: MessageService,
    private router: Router
  ) {
    const principal: Principal = new Principal();
    this.principal = new BehaviorSubject<Principal>(principal);
    if(this.token) this.loginWithToken(this.token);
    AaService.instance = this;
  }



  get token(): string | null {
      return localStorage.getItem('token');
  }

  set token(token2set) {
    if (token2set) localStorage.setItem('token', token2set);
  }

  /*
  get user(): any {
    const user_string = sessionStorage.getItem('user');
    if (user_string) return JSON.parse(user_string);
  }

  set user(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

   */


  get isLoggedInObservable(): Observable<boolean> {
    return this.principal.asObservable().pipe(map(p => p.loggedIn));
  }
  get isLoggedIn(): boolean {
    return this.principal.getValue().loggedIn;
  }

    /*
    const isLoggedIn_string = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn_string) {
      return !!JSON.parse(isLoggedIn_string);
    } else {
      return false;
    }


  /*

  set isLoggedIn(bool) {
    sessionStorage.setItem('isLoggedIn', String(bool));
  }

  get isAdmin(): boolean {
    const isAdmin_string = sessionStorage.getItem('isAdmin');
    if (isAdmin_string) {
      return !!JSON.parse(isAdmin_string);
    } else {
      return false;
    }
  }

  set isAdmin(bool) {
    sessionStorage.setItem('isAdmin', String(bool));
  }

  get isDepositor(): boolean {
    const isDepositor_string = sessionStorage.getItem('isDepositor');
    if (isDepositor_string) {
      return !!JSON.parse(isDepositor_string);
    } else {
      return false;
    }
  }

  set isDepositor(bool) {
    sessionStorage.setItem('isDepositor', String(bool));
  }

  get isModerator(): boolean {
    const isModerator_string = sessionStorage.getItem('isModerator');
    if (isModerator_string) {
      return !!JSON.parse(isModerator_string);
    } else {
      return false;
    }
  }

  set isModerator(bool) {
    sessionStorage.setItem('isModerator', String(bool));
  }

   */

  loginWithToken(token: string) {
    console.log("Login with token ")
      this.token = token;

      console.log("New Principal logged in with token");
      //Get UserAccount
      this.who(token).subscribe(user => {
        let principal: Principal = new Principal();
        principal.loggedIn = true;
        principal.user = user;
        if (user.grantList.find((grant: any) => grant.role === 'SYSADMIN')) {
          principal.isAdmin = true;
        }

        //Get contexts
        forkJoin(
          [this.contextService.getContextsForCurrentUser("DEPOSITOR", user, token),
            this.contextService.getContextsForCurrentUser("MODERATOR", user, token)])
          .subscribe(results => {

            principal.depositorContexts = results[0].records.map(rec => rec.data);
            principal.isDepositor=principal.depositorContexts.length>0;
            principal.moderatorContexts = results[0].records.map(rec => rec.data);
            principal.isModerator=principal.moderatorContexts.length>0;

            this.principal.next(principal);
            console.log("New Principal logged in: " + principal.depositorContexts)
          })

      })
      return this.principal.asObservable();

  }

  login(userName: string, password: string) {
    console.log("Login with user " + userName)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = userName + ':' + password;
    return this.http.request('POST', this.tokenUrl, {
      body: body,
      headers: headers,
      observe: 'response',
      responseType: 'text',
    }).pipe(
      switchMap((response) => {
        const token = response.headers.get('Token');
        if (token != null) {
          return this.loginWithToken(token);
        } else {
          this.message.error(response.status + ' ' + response.statusText);
          return EMPTY;
        }
      }),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    this.principal.next(new Principal());
    this.router.navigate(['/'])
  }

  private who(token: string | string[]): Observable<AccountUserDbVO> {
    const headers = new HttpHeaders().set('Authorization', token);
    const whoUrl = this.tokenUrl + '/who';
    let user: any;

    return this.http.request<AccountUserDbVO>('GET', whoUrl, {
      headers: headers,
      observe: 'body',
    }).pipe(
      catchError((error) => {
        this.logout();
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}
