import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import {catchError, map, Observable, throwError} from 'rxjs';
import {AuditDbVO, ItemVersionVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends PubmanSearchableGenericRestClientService<ItemVersionVO>{

  constructor() {
    super('/items');
  }

  submit(id: string, lastModificationDate: Date, comment:string, authenticate?: boolean): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/submit', taskParam, authenticate);
  }

  release(id: string, lastModificationDate: Date, comment:string, authenticate?: boolean): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/release', taskParam, authenticate);
  }

  revise(id: string, lastModificationDate: Date, comment:string, authenticate?: boolean): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/revise', taskParam, authenticate);
  }

  withdraw(id: string, lastModificationDate: Date, comment:string, authenticate?: boolean): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/withdraw', taskParam, authenticate);
  }

  retrieveHistory(id: string, authenticate?: boolean): Observable<AuditDbVO[]> {
    return this.httpGet(this.subPath + '/' + id + '/history', authenticate);
  }

  retrieveAuthorizationInfo(itemId: string, authenticate?: boolean): Observable<any> {
    return this.httpGet(this.subPath + '/' + itemId + '/authorization', authenticate);
  }

  retrieveFileAuthorizationInfo(itemId: string, fileId:string, authenticate?: boolean): Observable<any> {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/authorization', authenticate);
  }

  retrieveSingleExport(id: string, format?: string, citation?:string, cslConeId?:string, authenticate?: boolean, respType?: "arraybuffer" | "blob" | "text" | "json" | undefined): Observable<any> {
    let params: HttpParams = new HttpParams()
    .set('format', format ? format : 'json_citation')
    .set('citation', citation ? citation : 'APA6');
    if(cslConeId) params=params.set('cslConeId', cslConeId);
    return this.httpGet(this.subPath + '/' + id + '/export', authenticate, params, respType);
  }

  retrieveSingleCitation(id: string, citation?:string, cslConeId?:string, authenticate?: boolean): Observable<string> {

    return this.retrieveSingleExport(id, 'json_citation', citation, cslConeId, authenticate).pipe(
      map(jsonCitation => {
        return jsonCitation.records[0].data.bibliographicCitation;
      })
    )
  }

  thumbnailAvalilable(itemId: string, fileId:string, authenticate?: boolean): Observable<boolean> {
    return this.httpHead(this.subPath + '/' + itemId + '/component/' + fileId + '/thumbnail', authenticate).pipe(
      map(resp => {return resp.status === 200})
    );

  }


  checkFileAudienceAccess(itemId: string, fileId: string) {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/content');
  }

  addDoi(id: string, authenticate?: boolean): Observable<ItemVersionVO> {
    return this.httpPut(this.subPath + '/' + id + '/addNewDoi',undefined, authenticate);
  }

  rollback(id: string, versionNumber:number, authenticate?: boolean): Observable<ItemVersionVO> {
    return this.httpPut(this.subPath + '/' + id + '_' + versionNumber + '/rollbackToVersion',undefined, authenticate);
  }

}
