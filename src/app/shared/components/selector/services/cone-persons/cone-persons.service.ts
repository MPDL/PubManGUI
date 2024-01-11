import { Injectable } from '@angular/core';
import { SelectedValue } from '../selector-datasource.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface ConePerson extends SelectedValue {
  id: string,
  type: string,
  value: string
}

export interface position_shite {
  http_purl_org_escidoc_metadata_terms_0_1_position_name: string,
  http_purl_org_eprint_terms_affiliatedInstitution: string,
  http_purl_org_dc_elements_1_1_identifier: string,
}

export interface PersonResource {
  id: string,
  http_purl_org_escidoc_metadata_terms_0_1_degree: string,
  http_purl_org_dc_elements_1_1_title: string,
  http_xmlns_com_foaf_0_1_givenname: string,
  http_purl_org_escidoc_metadata_terms_0_1_position: position_shite[] | position_shite,
  http_xmlns_com_foaf_0_1_family_name: string,
  http_purl_org_dc_terms_alternative: string
}

@Injectable({
  providedIn: 'root'
})
export class ConePersonsService {

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

  resource(uri: string) {
    const params = new HttpParams().set('uri', uri);
    return this.http.get<PersonResource>(this.rest_uri, { params }).pipe(
      map((response: any) => response),
      catchError((error) => {
        return throwError(() => new Error(JSON.stringify(error) || 'UNKNOWN ERROR!'));
      })
    );
  }
}
