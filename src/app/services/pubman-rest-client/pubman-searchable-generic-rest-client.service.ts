import { HttpOptions, PubmanGenericRestClientService, SearchResult } from "./pubman-generic-rest-client.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";

export abstract class PubmanSearchableGenericRestClientService<modelType> extends PubmanGenericRestClientService<modelType> {

  protected constructor(subPath: string) {
    super(subPath)
  }


  list(q?: string, size?: number, from?: number, opts?:HttpOptions):Observable<SearchResult<modelType>> {
    const params = new HttpParams({fromObject: {
        ...q && {q: q},
        ...size && {size: size},
        ...from && {from: from}
      }});

    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params})
    return this.httpGet(this.subPath, mergedOpts);
  }

  search(elasticBody: any, opts?:HttpOptions): Observable<SearchResult<modelType>> {
    const mergedOpts = this.addContentTypeHeader(opts);
    return this.getSearchResults(this.subPath.concat('/search'), elasticBody, mergedOpts);
  }

  elasticSearch(elasticBody: any, opts?:HttpOptions): Observable<any> {
    const mergedOpts = this.addContentTypeHeader(opts);
      return this.getElasticSearchResults('POST', this.subPath.concat('/elasticsearch'), elasticBody, mergedOpts);
  }

  searchAndExport(elasticBody: any, format?:string, citation?:string, cslConeId?: string, opts?:HttpOptions): Observable<HttpResponse<Blob>> {
    let params: HttpParams = new HttpParams()
      .set('format', format ? format : 'json_citation')
      .set('citation', citation ? citation : 'APA6');
    if(cslConeId) params=params.set('cslConeId', cslConeId);

    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params, responseType: "blob", observe: "response"});

    return this.getSearchResults(this.subPath.concat('/search'), elasticBody, mergedOpts);
  }

  private getSearchResults(path: string, body?: any, opts?:HttpOptions): Observable<any> {
    return this.httpPostJson(path, body, opts);
  }

  private getElasticSearchResults(method: string, path: string, body?: any, opts?:HttpOptions): Observable<SearchResult<modelType>> {
    return this.httpRequest(method, path, body, opts);
  }
}
