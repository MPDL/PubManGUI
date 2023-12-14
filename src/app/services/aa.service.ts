import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, switchMap, throwError } from 'rxjs';
// TODO when MessageService is integrated
// import { MessageService } from 'src/app/shared/services/message.service';

@Injectable({
  providedIn: 'root'
})

export class AaService {

  private tokenUrl = 'https://pure.mpg.de/rest/login';

  constructor(
    private http: HttpClient
    // TODO when MessageService is integrated
    // private message: MessageService
  ) { }

  get token(): string | null {
    return sessionStorage.getItem('token');
  }

  set token(token2set) {
    if (token2set) sessionStorage.setItem('token', token2set);
  }

  get user(): any {
    const user_string = sessionStorage.getItem('user');
    if (user_string) return JSON.parse(user_string);
  }

  set user(user) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  get isLoggedIn(): boolean {
    const isLoggedIn_string = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn_string) {
      return !!JSON.parse(isLoggedIn_string);
    } else {
      return false;
    }
  }

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

  login(userName: string, password: string) {
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
          this.token = token;
          this.isLoggedIn = true;
          return this.who(token);
        } else {
          // TODO when MessageService is integrated
          // this.message.error(response.status + ' ' + response.statusText);
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
  }

  who(token: string | string[]): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    const whoUrl = this.tokenUrl + '/who';
    let user: any;

    return this.http.request<any>('GET', whoUrl, {
      headers: headers,
      observe: 'body',
    }).pipe(
      map((response) => {
        user = response;
        this.user = user;
        if (user.grantList != null) {
          if (user.grantList.find((grant: any) => grant.role === 'SYSADMIN')) {
            this.isAdmin = true;
          }
        }
        return user;
      }),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}