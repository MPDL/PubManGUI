import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import * as props from 'src/assets/properties.json';

@Injectable({
  providedIn: 'root'
})
export class ConeService {

  rest_uri = props.cone_instance_uri;

  constructor(
    private http: HttpClient
  ) { }

  private getResources(method: string, path: string, body?: any, headers?: HttpHeaders, params?: HttpParams): Observable<any> {
    const requestUrl = this.rest_uri + path;
    console.log('rest_uri: ' + this.rest_uri); // DEBUG
    console.log('path: ' + path); // DEBUG
    console.log('requestUrl: ' + requestUrl); // DEBUG
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
