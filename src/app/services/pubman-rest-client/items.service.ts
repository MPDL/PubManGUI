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

  retrieveHistory(id: string, token?:string): Observable<any> {
    return this.httpGet(this.subPath + '/' + id + '/history', token);
  }

  checkFileAudienceAccess(itemId: string, fileId: string) {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/content');
  }

}
