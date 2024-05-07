import { Injectable } from '@angular/core';
import {PubmanGenericRestClientService, SearchResult} from "./pubman-generic-rest-client.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {HttpHeaders, HttpParams} from "@angular/common/http";

export abstract class PubmanSearchableGenericRestClientService<modelType> extends PubmanGenericRestClientService<modelType> {

  protected constructor(subPath: string) {
    super(subPath)
  }


  list(q?: string, size?: number, from?: number, token?: string):Observable<SearchResult<modelType>> {
    const params = new HttpParams({fromObject: {
        ...q && {q: q},
        ...size && {size: size},
        ...from && {from: from}
      }});
    if (token) {
      return this.getSearchResults('GET', this.subPath, null, this.addAuhorizationHeader(token), params);
    }
    return this.getSearchResults('GET', this.subPath, null, undefined, params);

  }

  search(elasticBody: any, token?: string): Observable<SearchResult<modelType>> {
    if (token) {
      return this.getSearchResults('POST', this.subPath.concat('/search'), elasticBody, this.addAuthAndContentType(token));
    }
    return this.getSearchResults('POST', this.subPath.concat('/search'), elasticBody, this.addContentTypeHeader());
  }

  elasticSearch(elasticBody: any, token?: string): Observable<any> {
    if (token) {
      return this.getElasticSearchResults('POST', this.subPath.concat('/elasticsearch'), elasticBody, this.addAuthAndContentType(token));
    }
    return this.getElasticSearchResults('POST', this.subPath.concat('/elasticsearch'), elasticBody, this.addContentTypeHeader());
  }

  private getSearchResults(method: string, path: string, body?: any, headers?: HttpHeaders, params?: HttpParams): Observable<SearchResult<modelType>> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request<SearchResult<modelType>>(method, requestUrl, {
      body,
      headers,
      params
    }).pipe(
      map((searchResult: SearchResult<any>) => searchResult),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }

  private getElasticSearchResults(method: string, path: string, body?: any, headers?: HttpHeaders, params?: HttpParams): Observable<SearchResult<modelType>> {
    const requestUrl = this.restUri + path;
    return this.httpClient.request<any>(method, requestUrl, {
      body,
      headers,
      params
    }).pipe(
      map((searchResult: any) => searchResult),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}
