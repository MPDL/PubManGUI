import { Injectable, inject } from '@angular/core';
import {map, Observable, tap} from 'rxjs';

import {HttpClient} from "@angular/common/http";
import {PubmanGenericRestClientService, SearchResult} from "./pubman-generic-rest-client.service";
import {AffiliationDbVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";



@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends PubmanSearchableGenericRestClientService<AffiliationDbVO>{

  static instance: OrganizationsService;

  constructor() {
    super('/ous');
    OrganizationsService.instance = this;
  }


  getallChildOus(parentAffiliationIds: string[], ignoreOuId: string, token: string): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/allchildren/' + ignoreOuId;
    const body = parentAffiliationIds;

    return this.httpPost(path, body, token);
  }

  getTopLevelOus(token: string): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/toplevel';
    return this.httpGet(path, token);
  }

  getFirstLevelOus(token: string): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/firstlevel';
    return this.httpGet(path, token);
  }

  listChildren4Ou(id: string, token: string): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/' + id + '/children';

    return this.httpGet(path, token);
  }

  getIdPath(id: string, token: string): Observable<string> {
    const path = this.subPath + '/' + id + '/idPath';

    return this.httpGet(path, token);
  }

  getOuPath(id: string, token: string): Observable<string> {
    const path = this.subPath + '/' + id + '/ouPath';

    return this.httpGet(path, token);
  }

  openOu(ou: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/open';
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, token);
  }

  closeOu(ou: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/close';
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, token);
  }

  removePredecessor(ou: AffiliationDbVO, predecessorId: string, token: string): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/remove/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, token);
  }

  addPredecessor(ou: AffiliationDbVO, predecessorId: string, token: string): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/add/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, token);
  }

  getSuccessors(id: string): Observable<SearchResult<AffiliationDbVO>> {
    const query = {
      query: {
        term: {
          "predecessorAffiliations.objectId": {
            value: id
          }
        }
      }
    }

    return this.search(query);

  }
}
