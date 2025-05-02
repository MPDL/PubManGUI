import {HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {inject, Inject, Injectable} from '@angular/core';
import {Observable, catchError, map, throwError, isObservable, lastValueFrom} from 'rxjs';
import { environment } from 'src/environments/environment';

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
  protected restUri = environment.inge_rest_uri;
  protected httpClient: HttpClient = inject(HttpClient);
  protected subPath:string;

  protected constructor(subPath: string) {
    this.subPath = subPath;
  }

  create(obj: modelType) : Observable<modelType> {
    console.log('Creating: ', typeof obj);
    return this.httpPost(this.subPath, obj);
  }

  retrieve(id: string, authenticate?: boolean): Observable<modelType> {
    return this.httpGet(this.subPath + '/' + id, authenticate);
  }

  update(id: string, obj: modelType): Observable<modelType> {
    console.log('Updating:', id, typeof id)
    return this.httpPut(this.subPath + '/' + id, obj);
  }

  delete(id: string, lastModificationDate: Date|undefined): Observable<number> {
    let taskParam = null;
    if (lastModificationDate) {
        const isoDate = new Date(lastModificationDate).toISOString();
        taskParam = {
          'lastModificationDate': isoDate
    }
  }
    return this.httpDelete(this.subPath + '/' + id, taskParam);
  }



  private httpRequest(method: string, path: string, body?: any, authenticate:boolean = true, headers?: HttpHeaders, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined, observe?:"body" | "events" | "response" | undefined ): Observable<any> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request(method, requestUrl, {
      body,
      headers,
      params: params,
      responseType: respType ? respType : 'json',
      observe: observe ? observe : 'body',
      withCredentials: authenticate

    }).pipe(
      //map((response: any) => response),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  private getHttpStatus(method: string, path: string, body: Date | undefined, authenticate:boolean = true, headers?: HttpHeaders): Observable<number> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request(method, requestUrl, {
      body,
      headers : undefined,
      observe: 'response',
      responseType: 'text',
      withCredentials: authenticate
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



  protected httpGet(path: string, authenticate?: boolean, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined): Observable<any> {
      return this.httpRequest('GET', path, undefined, authenticate, undefined, params, respType);

  }

  protected httpHead(path: string, authenticate?: boolean, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined): Observable<any> {
      return this.httpRequest('HEAD', path, undefined, authenticate, undefined, params, respType, 'response');
  }

  protected httpPost(path: string, resource: any, authenticate?: boolean, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined, observe?:"body" | "events" | "response" | undefined): Observable<any> {
    const body = JSON.stringify(resource);
    return this.httpRequest('POST', path, body, authenticate, this.addContentTypeHeader(), params, respType, observe);
  }

  protected httpPut(path: string, resource: any, authenticate?: boolean, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined, observe?:"body" | "events" | "response" | undefined): Observable<any> {
    const body = JSON.stringify(resource);
    return this.httpRequest('PUT', path, body, authenticate, this.addContentTypeHeader(), params, respType, observe);
  }

  protected httpDelete(path: string, body: any, authenticate?: boolean): Observable<number> {
    return this.getHttpStatus('DELETE', path, body, authenticate);
  }

}
