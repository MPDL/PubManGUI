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
  allContexts: ContextDbVO[] = [];
}

@Injectable({
  providedIn: 'root'
})
export class AaService {

  static instance: AaService;

  private loginUrl = props.inge_rest_uri.concat('/login');
  private logoutUrl = props.inge_rest_uri.concat('/logout');

  principal: BehaviorSubject<Principal>;

  constructor(
    private http: HttpClient,
    private contextService: ContextsService,
    private message: MessageService,
    private router: Router
  ) {
    const principal: Principal = new Principal();
    this.principal = new BehaviorSubject<Principal>(principal);
    this.checkLogin();
    AaService.instance = this;
  }



  get token(): string | undefined {
    /*
    const t = localStorage.getItem('token');
    if(t!=null)
      return t
    else return undefined;

     */
    return undefined;
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.principal.asObservable().pipe(map(p => p.loggedIn));
  }
  get isLoggedIn(): boolean {
    return this.principal.getValue().loggedIn;
  }

  checkLogin() {
      console.log("Check login")
      //this.token = token;

      //console.log("New Principal logged in with token");
      //Get UserAccount
      this.who().subscribe(user => {
        let principal: Principal = new Principal();
        if(user) {
          principal.loggedIn = true;
          principal.user = user;
          if (user.grantList.find((grant: any) => grant.role === 'SYSADMIN')) {
            principal.isAdmin = true;
          }



          forkJoin(
            [this.contextService.getContextsForCurrentUser("DEPOSITOR", user),
              this.contextService.getContextsForCurrentUser("MODERATOR", user)])
            .subscribe(results => {

              if(results[0]) {
                principal.depositorContexts = results[0].records.map(rec => rec.data);
                principal.isDepositor = principal.depositorContexts.length > 0;
              }
              if(results[1]) {
                principal.moderatorContexts = results[1].records.map(rec => rec.data);
                principal.isModerator = principal.moderatorContexts.length > 0;
              }

              this.principal.next(principal);
              console.log("New Principal logged in: " + principal.depositorContexts)
            })
        }

      })
      return this.principal.asObservable();

  }

  login(userName: string, password: string) {
    console.log("Login with user " + userName)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = userName + ':' + password;
    return this.http.request('POST', this.loginUrl, {
      body: body,
      headers: headers,
      observe: 'response',
      responseType: 'text',
      withCredentials: true
    }).pipe(
      switchMap((response) => {
        const token = response.headers.get('Token');

        if (response.status === 200) {
          return this.checkLogin();
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
    this.http.request('GET', this.logoutUrl, {observe: "response", responseType: "text"}).pipe(
      tap(res => {
      if(res.status === 200) {
        console.log("Successfully logged out from backend");
      }
      sessionStorage.clear();
      localStorage.clear();
      this.principal.next(new Principal());
      this.message.info("Logged out successfully");
      this.router.navigate(['/'])
    })
    ).subscribe()

  }

  private who(): Observable<AccountUserDbVO> {
    //const headers = new HttpHeaders().set('Authorization', token);
    const whoUrl = this.loginUrl + '/who';
    let user: any;

    return this.http.request<AccountUserDbVO>('GET', whoUrl, {
      //headers: headers,
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError((error) => {
        console.log(error);
        //this.logout();
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}
