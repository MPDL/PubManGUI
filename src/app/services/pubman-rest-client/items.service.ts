import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import {map, Observable} from 'rxjs';
import {ItemVersionVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";
import {HttpParams} from "@angular/common/http";

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

  retrieveFileAuthorizationInfo(itemId: string, fileId:string, token?: string): Observable<any> {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/authorization', token);
  }

  retrieveSingleExport(id: string, format?: string, citation?:string, cslConeId?:string, token?:string, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined): Observable<any> {
    let params: HttpParams = new HttpParams()
    .set('format', format ? format : 'json_citation')
    .set('citation', citation ? citation : 'APA6');
    if(cslConeId) params=params.set('cslConeId', cslConeId);
    return this.httpGet(this.subPath + '/' + id + '/export', token, params, respType);
  }

  retrieveSingleCitation(id: string, citation?:string, cslConeId?:string, token?:string): Observable<string> {

    return this.retrieveSingleExport(id, 'json_citation', citation, cslConeId, token).pipe(
      map(jsonCitation => {
        return jsonCitation.records[0].data.bibliographicCitation;
      })
    )
  }

  checkFileAudienceAccess(itemId: string, fileId: string) {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/content');
  }

}
