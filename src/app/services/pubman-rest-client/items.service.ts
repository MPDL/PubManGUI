import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';
import {ItemVersionVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends PubmanSearchableGenericRestClientService<ItemVersionVO>{

  constructor() {
    super('/items');
  }

  submit(id: string, lastModificationDate: Date, comment:string, token:string): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/submit', taskParam, token);
  }

  release(id: string, lastModificationDate: Date, comment:string, token:string): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/release', taskParam, token);
  }

  revise(id: string, lastModificationDate: Date, comment:string, token:string): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/revise', taskParam, token);
  }

  withdraw(id: string, lastModificationDate: Date, comment:string, token:string): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/withdraw', taskParam, token);
  }

  retrieveHistory(id: string, token?:string): Observable<any> {
    return this.httpGet(this.subPath + '/' + id + '/history', token);
  }

  retrieveAuthorizationInfo(itemId: string, token?: string): Observable<any> {
    return this.httpGet(this.subPath + '/' + itemId + '/authorization', token);
  }

  checkFileAudienceAccess(itemId: string, fileId: string) {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/content');
  }

}
