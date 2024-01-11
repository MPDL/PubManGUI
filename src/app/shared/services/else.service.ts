import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ElseService {

  base_url = environment.else_rest_url;

  constructor(
    private http: HttpClient,
  ) { }

  getResource(method: string, url: string, heads: HttpHeaders, request_body: any): Observable<any> {
    return this.http.request<any>(method, url, {
      headers: heads,
      body: request_body
    }).pipe(
      map((response: HttpResponse<any>) => {
        const resource = response;
        return resource;
      })
    );
  }

  addHeaders(token?: string, ct?: boolean): HttpHeaders {
    if (token != null) {
      if (ct) {
        const headers = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', token);
        return headers;
      } else {
        const headers = new HttpHeaders()
          .set('Authorization', token);
        return headers;
      }
    } else {
      return new HttpHeaders();
    }
  }

  get(path: string, token?: string): Observable<any> {
    const resourceUrl = this.base_url + path;
    const headers = this.addHeaders(token, false);
    return this.getResource('GET', resourceUrl, headers, null);
  }

  post(path: string, resource: any, token?: string): Observable<any> {
    const headers = this.addHeaders(token, true);
    const requestUrl = this.base_url + path;
    return this.getResource('POST', requestUrl, headers, resource);
  }

  put(path: string, resource: any, token?: string): Observable<any> {
    const headers = this.addHeaders(token, true);
    const requestUrl = this.base_url + path;
    return this.getResource('PUT', requestUrl, headers, resource);
  }

  del(path: string, token?: string): Observable<any> {
    const headers = this.addHeaders(token, true);
    const requestUrl = this.base_url + path;
    return this.getResource('DELETE', requestUrl, headers, null);
  }
}
