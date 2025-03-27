import {Injectable, inject} from '@angular/core';

import {Observable} from 'rxjs';

import { OrganizationsService } from './organizations.service';
import {PubmanGenericRestClientService} from "./pubman-generic-rest-client.service";
import {AccountUserDbVO, GrantVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";

@Injectable({
  providedIn: 'root'
})
export class UsersService extends PubmanSearchableGenericRestClientService<AccountUserDbVO>{
  organizationService: OrganizationsService = inject(OrganizationsService)


  constructor() {
    super('/users');
  }

  activate(user: AccountUserDbVO, authenticate?: boolean): Observable<AccountUserDbVO> {
    const path = this.subPath + '/' + user.objectId + '/activate';
    const body = user.lastModificationDate;

    return this.httpPut(path, body, authenticate);
  }

  deactivate(user: AccountUserDbVO, authenticate?: boolean): Observable<AccountUserDbVO> {
    const path = this.subPath + '/' + user.objectId + '/deactivate';
    const body = user.lastModificationDate;

    return this.httpPut(path, body, authenticate);

  }

  addGrants(user: AccountUserDbVO, grants: GrantVO[], authenticate?: boolean): Observable<AccountUserDbVO> {
    const path = this.subPath + '/' + user.objectId + '/add';
    const body = JSON.stringify(grants);

    return this.httpPut(path, body, authenticate);
  }

  removeGrants(user: AccountUserDbVO, grants: GrantVO[], authenticate?: boolean): Observable<AccountUserDbVO> {
    const path = this.subPath + '/' + user.objectId + '/remove';
    const body = JSON.stringify(grants);

    return this.httpPut(path, body, authenticate);
  }

  changePassword(user: AccountUserDbVO, authenticate?: boolean): Observable<AccountUserDbVO> {
    const path = this.subPath + '/' + user.objectId + '/password';
    const body = user.password;

    return this.httpPut(path, body, authenticate);
  }

  generateRandomPassword(authenticate?: boolean): Observable<string> {
    const path = this.subPath + '/generateRandomPassword';

    return this.httpGet(path, authenticate);
  }

  /*
  addAdditionalPropertiesOfGrantRefs(grant: GrantVO) {
    const ref = grant.objectRef;
    if (ref === undefined) {
    } else {
      if (ref.startsWith('ou')) {
        this.organizationsService.get(this.ousPath, ref, null)
          .subscribe({
            next: (data: Ou) => {
              grant.objectName = data.name;
              grant.objectStatus = data.publicStatus;
            },
            error: (e) => this.messagesService.error(e),
          });
      } else {
        if (ref.startsWith('ctx')) {
          this.contextsService.get(this.ctxsPath, ref, null)
            .subscribe({
              next: (data: Ctx) => {
                grant.objectName = data.name;
                grant.objectStatus = data.state;
              },
              error: (e) => this.messagesService.error(e),
            });
        }
      }
    }
  }

  addOuPathOfGrantRefs(grant: Grant) {
    const ref = grant.objectRef;
    if (ref === undefined) {
    } else {
      if (ref.startsWith('ou')) {
        this.organizationsService.get(this.ousPath, grant.objectRef, null)
          .subscribe({
            next: (data: Ou) => grant.parentName = data.parentAffiliation.name,
            error: (e) => this.messagesService.error(e),
          });
      } else {
        if (ref.startsWith('ctx')) {
          this.contextsService.get(this.ctxsPath, ref, null)
            .subscribe({
              next: (data: Ctx) => {
                this.organizationsService.getOuPath(data.responsibleAffiliations[0].objectId, null)
                  .subscribe({
                    next: (data: string) => grant.parentName = data,
                    error: (e) => this.messagesService.error(e),
                  });
              },
              error: (e) => this.messagesService.error(e),
            });
        }
      }
    }
  }*/
}
