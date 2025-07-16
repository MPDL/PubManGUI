import { PubmanGenericRestClientService, SearchResult } from "./pubman-generic-rest-client.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";

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

    return this.httpGet(this.subPath, authenticate, params);
  }

  search(elasticBody: any, authenticate?:boolean): Observable<SearchResult<modelType>> {
    return this.getSearchResults(this.subPath.concat('/search'), elasticBody, authenticate, this.addContentTypeHeader());
  }

  elasticSearch(elasticBody: any, authenticate?:boolean): Observable<any> {
      return this.getElasticSearchResults('POST', this.subPath.concat('/elasticsearch'), elasticBody, authenticate, this.addContentTypeHeader());
  }

  searchAndExport(elasticBody: any, format?:string, citation?:string, cslConeId?: string, authenticate?:boolean): Observable<HttpResponse<Blob>> {
    let params: HttpParams = new HttpParams()
      .set('format', format ? format : 'json_citation')
      .set('citation', citation ? citation : 'APA6');
    if(cslConeId) params=params.set('cslConeId', cslConeId);

    return this.getSearchResults(this.subPath.concat('/search'), elasticBody, authenticate, this.addContentTypeHeader(), params, "blob", "response");
  }

  private getSearchResults(path: string, body?: any, authenticate:boolean =true, headers?: HttpHeaders, params?: HttpParams, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined, observe?:"body" | "events" | "response" | undefined): Observable<any> {
    return this.httpPost(path, body, authenticate, params, respType, observe);
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
