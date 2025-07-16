import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, forkJoin, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { MessageService } from 'src/app/shared/services/message.service';
import { environment } from 'src/environments/environment';
import { AccountUserDbVO, ContextDbVO, ItemVersionState } from "../model/inge";
import { ContextsService } from "./pubman-rest-client/contexts.service";
import { Router } from "@angular/router";


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

  private loginUrl = environment.inge_rest_uri.concat('/login');
  private logoutUrl = environment.inge_rest_uri.concat('/logout');

  principal: BehaviorSubject<Principal>;


  constructor(
    private http: HttpClient,
    private contextService: ContextsService,
    private message: MessageService,
    private router: Router
  ) {
    const principal: Principal = new Principal();
    this.principal = new BehaviorSubject<Principal>(principal);
    //this.checkLogin();
    AaService.instance = this;
  }

  get isLoggedInObservable(): Observable<boolean> {
    return this.principal.asObservable().pipe(map(p => p.loggedIn));
  }
  get isLoggedIn(): boolean {
    return this.principal.getValue().loggedIn;
  }

  checkLogin(): Observable<Principal> {
    console.log("Check login");

    return this.who().pipe(
      switchMap(user => {
        let principal: Principal = new Principal();
        if (!user) {
          this.principal.next(principal);
          return of(principal);
        }

        principal.loggedIn = true;
        principal.user = user;
        principal.isAdmin = !!user.grantList.find((grant: any) => grant.role === 'SYSADMIN');

        return forkJoin([
          this.contextService.getContextsForCurrentUser("DEPOSITOR", user),
          this.contextService.getContextsForCurrentUser("MODERATOR", user)
        ]).pipe(
          map(([depositorResults, moderatorResults]) => {
            if (depositorResults) {
              principal.depositorContexts = depositorResults.records.map(rec => rec.data);
              principal.isDepositor = principal.depositorContexts.length > 0;
            }
            if (moderatorResults) {
              principal.moderatorContexts = moderatorResults.records.map(rec => rec.data);
              principal.isModerator = principal.moderatorContexts.length > 0;
            }

            this.principal.next(principal);
            return principal;
          })
        );
      })
    );
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

  /**
   * Constructs and returns a query object that filters data based on the provided states
   * and the user's role and permissions.
   *
   * @param {string[]} states - An array of strings representing the desired states
   *     to filter for, such as "SUBMITTED" or "IN_REVISION".
   * @return {Object} The constructed query object formatted for filtering purposes.
   *     Returns undefined if no valid query can be constructed.
   */
  public filterOutQuery(states: string[]) {
    let moderatorQuery: any = undefined;
    let depositorQuery: any = undefined;
    const depositorStates:string[] = states.filter(state => state === ItemVersionState.PENDING.valueOf());
    const moderatorStates:string[] = states.filter(state => state === ItemVersionState.SUBMITTED.valueOf() || state === ItemVersionState.IN_REVISION.valueOf());

    if(this.principal.getValue().moderatorContexts.length > 0 && moderatorStates.length > 0)
    {
      moderatorQuery =
        {
          bool: {
            must : [
              {
                "terms": {
                  "latestVersion.versionState": moderatorStates
                }
              },
              {
                "terms": {
                  "context.objectId": this.principal.getValue().moderatorContexts.map(context => context.objectId)
              }
              }
            ]
          }
        }
    }

    if(this.principal.getValue().loggedIn && depositorStates.length > 0) {
      depositorQuery = {
        bool: {
          must : [
            {
              "terms": {
                "latestVersion.versionState": depositorStates
              }
            },
            {
              "term": {
                "creator.objectId": this.principal?.getValue()?.user?.objectId
              }
            }
          ]
        }
      }
    }

    console.log("Moderator query: " + JSON.stringify(moderatorQuery))

    if(moderatorQuery === undefined && depositorQuery === undefined) {
      return undefined;
    }
    else {

      const query =
        {
          "bool": {
            "must": [
              {
                "term": {
                  "versionState": "RELEASED"
                }
              },
              {
                bool: {
                  should: [
                    ...depositorQuery ? [depositorQuery] : [],
                    ...moderatorQuery ? [moderatorQuery] : []
                  ]
                }
              }
            ]
          }
        }

      return query;
    }

  }




}
