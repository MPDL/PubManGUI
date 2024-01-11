import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConeService {

  rest_uri = environment.dowm_url.concat('/isis/cone');

  constructor(
    private http: HttpClient
  ) { }

  private getResources(method: string, path: string, body?: any, headers?: HttpHeaders, params?: HttpParams): Observable<any> {
    const requestUrl = this.rest_uri + path;
    return this.http.request(method, requestUrl, {
      body,
      headers,
      params,
    }).pipe(
      map((response: any) => response),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  find(resource_type: string, params?: HttpParams) {
    return this.getResources('GET', resource_type, undefined, undefined, params);
  }
}
