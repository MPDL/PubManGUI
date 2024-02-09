import {Injectable, inject} from '@angular/core';
import { MessageService } from '../shared/services/message.service';
import {Observable} from 'rxjs';
import { IngeCrudService } from './inge-crud.service';
import { AccountUserDbVO, GrantVO } from '../model/inge';
import { OrganizationsService } from './organizations.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends IngeCrudService{
  usersPath: string = '/useres';
  
  messagesService: MessageService = inject(MessageService);
  organizationService: OrganizationsService = inject(OrganizationsService)

  getUser(userId: string, token?: string): Observable<AccountUserDbVO>{
    const path = this.usersPath + '/' + userId;
    if(token) {
      return this.get(path, token);
    } else {
      return this.get(path);
    }
  }

  createUser(user: AccountUserDbVO, token: string): Observable<AccountUserDbVO> {
    return this.post(this.usersPath, user, token);
  }

  updateUser(user: AccountUserDbVO, token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId
    
    return this.put(path, user, token);
  }

  deleteUser(user: AccountUserDbVO, token: string ): Observable<Number>{
    const path = this.usersPath + '/' + user.objectId;
    return this.delete(path, null, token);
  }

  activate(user: AccountUserDbVO, token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId + '/activate';
    const body = user.lastModificationDate;

    return this.put(path, body, token);
  }

  deactivate(user: AccountUserDbVO, token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId + '/deactivate';
    const body = user.lastModificationDate;

    return this.put(path, body, token);

  }

  addGrants(user: AccountUserDbVO, grants: GrantVO[], token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId + '/add';
    const body = JSON.stringify(grants);

    return this.put(path, body, token);
  }

  removeGrants(user: AccountUserDbVO, grants: GrantVO[], token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId + '/remove';
    const body = JSON.stringify(grants);

    return this.put(path, body, token);
  }

  changePassword(user: AccountUserDbVO, token: string): Observable<AccountUserDbVO> {
    const path = this.usersPath + '/' + user.objectId + '/password';
    const body = user.password;

    return this.put(path, body, token);
  }

  generateRandomPassword(token: string): Observable<string> {
    const path = this.usersPath + '/generateRandomPassword';

    return this.get(path, token);
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
