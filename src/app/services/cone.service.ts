import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConeService {

  rest_uri = environment.cone_instance_uri;

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

  getPersonResource(uri: string) {
    const params = new HttpParams().set('format', 'json');
    console.log('uri: ' + uri); // DEBUG
    return this.http.get<PersonResource>(uri, { params }).pipe(
      map((response: any) => response),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}

export interface PersonResource {
  id: string,
  http_purl_org_escidoc_metadata_terms_0_1_degree: string,
  http_purl_org_dc_elements_1_1_title: string,
  http_xmlns_com_foaf_0_1_givenname: string,
  http_purl_org_escidoc_metadata_terms_0_1_position: position_shite[] | position_shite,
  http_xmlns_com_foaf_0_1_family_name: string,
  http_purl_org_dc_terms_alternative: string,
  http_purl_org_dc_elements_1_1_identifier: identifier_bunch[] | identifier_bunch
}

export interface position_shite {
  http_purl_org_escidoc_metadata_terms_0_1_position_name: string,
  http_purl_org_eprint_terms_affiliatedInstitution: string,
  http_purl_org_dc_elements_1_1_identifier: string,
}

export interface identifier_bunch {
  http_www_w3_org_1999_02_22_rdf_syntax_ns_value: string,
  http_www_w3_org_2001_XMLSchema_instance_type: string
}
