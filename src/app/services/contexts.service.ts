import { Injectable } from '@angular/core';
import { IngeCrudService } from './inge-crud.service';
import { Observable } from 'rxjs';
import { ContextDbVO } from '../model/inge';

@Injectable({
  providedIn: 'root'
})
export class ContextsService extends IngeCrudService{
  contextsPath: string = '/contexts';

  getUser(userId: string, token?: string): Observable<ContextDbVO>{
    const path = this.contextsPath + '/' + userId;
    if(token) {
      return this.get(path, token);
    } else {
      return this.get(path);
    }
  }

  createUser(user: ContextDbVO, token: string): Observable<ContextDbVO> {
    return this.post(this.contextsPath, user, token);
  }

  updateUser(user: ContextDbVO, token: string): Observable<ContextDbVO> {
    const path = this.contextsPath + '/' + user.objectId
    
    return this.put(path, user, token);
  }

  deleteUser(user: ContextDbVO, token: string ): Observable<Number>{
    const path = this.contextsPath + '/' + user.objectId;
    return this.delete(path, null, token);
  }

  openContext(context: ContextDbVO, token: string): Observable<ContextDbVO> {
    const path = this.contextsPath + '/' + context.objectId + '/open';
    const body = context.lastModificationDate;

    return this.put(path, context, token);

  }

  closeContext(context: ContextDbVO, token: string): Observable<ContextDbVO> {
    const path = this.contextsPath + '/' + context.objectId + '/close';
    const body = context.lastModificationDate;

    return this.put(path, context, token);
  }
}
