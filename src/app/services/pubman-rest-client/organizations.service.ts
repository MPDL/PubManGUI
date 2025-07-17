import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from "./pubman-generic-rest-client.service";
import { AffiliationDbVO } from "../../model/inge";
import { PubmanSearchableGenericRestClientService } from "./pubman-searchable-generic-rest-client.service";


@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends PubmanSearchableGenericRestClientService<AffiliationDbVO>{

  static instance: OrganizationsService;

  constructor() {
    super('/ous');
    OrganizationsService.instance = this;
  }


  getallChildOus(parentAffiliationIds: string[], ignoreOuId: string, authenticate: boolean): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/allchildren/' + ignoreOuId;
    const body = parentAffiliationIds;

    return this.httpPost(path, body, authenticate);
  }

  getTopLevelOus(authenticate?: boolean): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/toplevel';
    return this.httpGet(path, authenticate);
  }

  getFirstLevelOus(authenticate?: boolean): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/firstlevel';
    return this.httpGet(path, authenticate);
  }

  listChildren4Ou(id: string, authenticate?: boolean): Observable<AffiliationDbVO[]> {
    const path = this.subPath + '/' + id + '/children';

    return this.httpGet(path, authenticate);
  }

  getIdPath(id: string, authenticate?: boolean): Observable<string> {
    const path = this.subPath + '/' + id + '/idPath';

    return this.httpGet(path, authenticate);
  }

  getOuPath(id: string, authenticate?: boolean): Observable<string> {
    const path = this.subPath + '/' + id + '/ouPath';

    return this.httpGet(path, authenticate);
  }

  openOu(ou: AffiliationDbVO, authenticate?: boolean): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/open';
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, authenticate);
  }

  closeOu(ou: AffiliationDbVO, authenticate?: boolean): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/close';
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, authenticate);
  }

  removePredecessor(ou: AffiliationDbVO, predecessorId: string, authenticate?: boolean): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/remove/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, authenticate);
  }

  addPredecessor(ou: AffiliationDbVO, predecessorId: string, authenticate?: boolean): Observable<AffiliationDbVO> {
    const path = this.subPath + '/' + ou.objectId + '/add/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.httpPut(path, body, authenticate);
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
