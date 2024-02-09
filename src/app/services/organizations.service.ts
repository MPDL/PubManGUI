import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AffiliationDbVO, BasicDbRO, MdsOrganizationalUnitDetailsVO } from '../model/inge';
import { IngeCrudService } from './inge-crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationsService extends IngeCrudService{
  ousPath:string = '/ous';
  ingeCrudService: IngeCrudService = inject(IngeCrudService);

  getOrganization(organizationId: string, token?: string): Observable<AffiliationDbVO>{
    const path = this.ousPath + '/' + organizationId;
    if(token) {
      return this.get(path, token);
    } else {
      return this.get(path);
    }
  }

  createOrganization(organization: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    return this.post(this.ousPath, organization, token);
  }

  updateOrganization(organization: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    const path = this.ousPath + '/' + organization.objectId
    
    return this.put(path, organization, token);
  }

  deleteOrganization(organization: AffiliationDbVO, token: string ): Observable<Number>{
    const path = this.ousPath + '/' + organization.objectId;
    return this.delete(path, null, token);
  }

  getallChildOus(parentAffiliationIds: string[], ignoreOuId: string, token: string): Observable<AffiliationDbVO[]> {
    const path = this.ousPath + '/allchildren/' + ignoreOuId;
    const body = parentAffiliationIds;

    return this.post(path, body, token);
  }

  getTopLevelOus(token: string): Observable<AffiliationDbVO[]> {
    const path = this.ousPath + '/toplevel';

    return this.get(path, token);
  }

  getFirstLevelOus(token: string): Observable<AffiliationDbVO[]> {
    const path = this.ousPath + '/firstlevel';

    return this.get(path, token);
  }

  listChildren4Ou(id: string, token: string): Observable<AffiliationDbVO[]> {
    const path = this.ousPath + '/' + id + '/children';

    return this.get(path, token);
  }

  getIdPath(id: string, token: string): Observable<string> {
    const path = this.ousPath + '/' + id + '/idPath';

    return this.get(path, token);
  }

  getOuPath(id: string, token: string): Observable<string> {
    const path = this.ousPath + '/' + id + '/ouPath';

    return this.get(path, token);
  }

  openOu(ou: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    const path = this.ousPath + '/' + ou.objectId + '/open';
    const body = ou.lastModificationDate;

    return this.put(path, body, token);
  }

  closeOu(ou: AffiliationDbVO, token: string): Observable<AffiliationDbVO> {
    const path = this.ousPath + '/' + ou.objectId + '/close';
    const body = ou.lastModificationDate;

    return this.put(path, body, token);
  }

  removePredecessor(ou: AffiliationDbVO, predecessorId: string, token: string): Observable<AffiliationDbVO> {
    const path = this.ousPath + '/' + ou.objectId + '/remove/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.put(path, body, token);
  }

  addPredecessor(ou: AffiliationDbVO, predecessorId: string, token: string): Observable<AffiliationDbVO> {
    const path = this.ousPath + '/' + ou.objectId + '/add/' + predecessorId;
    const body = ou.lastModificationDate;

    return this.put(path, body, token);
  }
}
