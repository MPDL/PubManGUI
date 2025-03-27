import { Injectable } from '@angular/core';
import {PubmanGenericRestClientService, SearchResult} from "./pubman-generic-rest-client.service";
import {catchError, map, Observable, throwError} from "rxjs";
import { HttpHeaders, HttpParams } from "@angular/common/http";

export abstract class PubmanSearchableGenericRestClientService<modelType> extends PubmanGenericRestClientService<modelType> {

  protected constructor(subPath: string) {
    super(subPath)
  }


  list(q?: string, size?: number, from?: number, authenticate?:boolean):Observable<SearchResult<modelType>> {
    const params = new HttpParams({fromObject: {
        ...q && {q: q},
        ...size && {size: size},
        ...from && {from: from}
      }});

      return this.getSearchResults('GET', this.subPath, null, authenticate, this.addContentTypeHeader(), params);

  }

  search(elasticBody: any, authenticate?:boolean): Observable<SearchResult<modelType>> {
    return this.getSearchResults('POST', this.subPath.concat('/search'), elasticBody, authenticate, this.addContentTypeHeader());
  }

  elasticSearch(elasticBody: any, authenticate?:boolean): Observable<any> {
      return this.getElasticSearchResults('POST', this.subPath.concat('/elasticsearch'), elasticBody, authenticate, this.addContentTypeHeader());
  }

  private getSearchResults(method: string, path: string, body?: any, authenticate:boolean =true, headers?: HttpHeaders, params?: HttpParams): Observable<SearchResult<modelType>> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request<SearchResult<modelType>>(method, requestUrl, {
      body,
      headers,
      params,
      withCredentials: authenticate
    }).pipe(
      map((searchResult: SearchResult<any>) => searchResult),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  private getElasticSearchResults(method: string, path: string, body?: any, authenticate:boolean =true, headers?: HttpHeaders, params?: HttpParams): Observable<SearchResult<modelType>> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request<any>(method, requestUrl, {
      body,
      headers,
      params,
      withCredentials: authenticate
    }).pipe(
      map((searchResult: any) => searchResult),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}
