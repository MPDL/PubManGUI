import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {inject, Inject, Injectable} from '@angular/core';
import {Observable, catchError, map, throwError, isObservable, lastValueFrom} from 'rxjs';
import * as props from 'src/assets/properties.json';

export interface SearchResult<Type> {
  numberOfRecords: number,
  records: {
    data: Type,
    persistenceId: string
  }[]
}

export interface TaskParamVO {
  comment?: string,
  lastModificationDate: Date
}

export abstract class PubmanGenericRestClientService<modelType> {

  // restUri = 'https://gui.inge.mpdl.mpg.de/rest';
  // restUri = 'https://qa.pure.mpdl.mpg.de/rest';
  protected restUri = props.inge_rest_uri;
  protected httpClient: HttpClient = inject(HttpClient);
  protected subPath:string;

  protected constructor(subPath: string) {
    this.subPath = subPath;
  }

  create(obj: modelType, token:string) : Observable<modelType> {
    console.log('Creating Item');
    return this.httpPost(this.subPath, obj, token);
  }

  retrieve(id: string, token?:string): Observable<modelType> {
    return this.httpGet(this.subPath + '/' + id, token);
  }

  update(id: string, obj: modelType, token:string): Observable<modelType> {
    console.log('Updating item', id)
    return this.httpPut(this.subPath + '/' + id, obj, token);
  }

  delete(id: string, token:string): Observable<number> {
    return this.httpDelete(this.subPath + '/' + id, null, token);
  }



  private httpRequest(method: string, path: string, body?: any, headers?: HttpHeaders, params?: HttpParams): Observable<modelType> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request(method, requestUrl, {
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

  private getHttpStatus(method: string, path: string, body: Date | undefined, headers: HttpHeaders): Observable<number> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request(method, requestUrl, {
      body,
      headers,
      observe: 'response',
      responseType: 'text',
    }).pipe(
      map((response) => {
        const status = response.status;
        return status;
      }),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  protected addContentTypeHeader(): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return headers;
  }

  protected addAuhorizationHeader(token: string): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', token);
    return headers;
  }

  protected addAuthAndContentType(token: string): HttpHeaders {
    const headers = new HttpHeaders()
      .set('Authorization', token)
      .set('Content-Type', 'application/json');
    return headers;
  }



  protected httpGet(path: string, token?: string, params?: HttpParams): Observable<any> {
    if (token) {
      return this.httpRequest('GET', path, undefined, this.addAuhorizationHeader(token), params);
    }
    return this.httpRequest('GET', path, undefined, undefined, params);
  }

  protected httpPost(path: string, resource: any, token: string): Observable<any> {
    const body = JSON.stringify(resource);
    return this.httpRequest('POST', path, body, this.addAuthAndContentType(token));
  }

  protected httpPut(path: string, resource: any, token: string): Observable<any> {
    const body = JSON.stringify(resource);
    return this.httpRequest('PUT', path, body, this.addAuthAndContentType(token));
  }

  protected httpDelete(path: string, body: any, token: string): Observable<number> {
    return this.getHttpStatus('DELETE', path, body, this.addAuhorizationHeader(token));
  }

}
