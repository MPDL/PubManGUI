import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuditDbVO, exportTypes, ItemVersionVO } from "../../model/inge";
import { PubmanSearchableGenericRestClientService } from "./pubman-searchable-generic-rest-client.service";
import { HttpParams } from "@angular/common/http";
import { HttpOptions } from "./pubman-generic-rest-client.service";

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends PubmanSearchableGenericRestClientService<ItemVersionVO>{

  constructor() {
    super('/items');
  }

  submit(id: string, lastModificationDate: Date, comment:string, opts?: HttpOptions): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/submit', taskParam, opts);
  }

  release(id: string, lastModificationDate: Date, comment:string, opts?: HttpOptions): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/release', taskParam, opts);
  }

  revise(id: string, lastModificationDate: Date, comment:string, opts?: HttpOptions): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/revise', taskParam, opts);
  }

  withdraw(id: string, lastModificationDate: Date, comment:string, opts?: HttpOptions): Observable<ItemVersionVO> {
    const isoDate = new Date(lastModificationDate).toISOString();

    const taskParam = {
      'lastModificationDate': isoDate,
      'comment': comment
    }
    return this.httpPut(this.subPath + '/' + id + '/withdraw', taskParam, opts);
  }

  retrieveHistory(id: string, opts?: HttpOptions): Observable<AuditDbVO[]> {
    return this.httpGet(this.subPath + '/' + id + '/history', opts);
  }

  retrieveAuthorizationInfo(itemId: string, afterSave:boolean=false, opts?: HttpOptions): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('afterSave', afterSave);
    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params});
    return this.httpGet(this.subPath + '/' + itemId + '/authorization', mergedOpts);
  }

  retrieveAuthorizationInfoForCreation(contextId:string, afterSave:boolean=false, opts?: HttpOptions): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('contextId', contextId)
      .set('afterSave', afterSave);
    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params});
    return this.httpGet(this.subPath + '/authorization', mergedOpts);
  }

  retrieveFileAuthorizationInfo(itemId: string, fileId:string, opts?: HttpOptions): Observable<any> {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/authorization', opts);
  }

  retrieveSingleExport(id: string, format?: string, citation?:string, cslConeId?:string, opts?: HttpOptions): Observable<any> {
    let params: HttpParams = new HttpParams()
    .set('format', format ? format : 'json_citation')
    .set('citation', citation ? citation : 'APA6');
    if(cslConeId) params=params.set('cslConeId', cslConeId);

    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params});

    return this.httpGet(this.subPath + '/' + id + '/export', mergedOpts);
  }

  retrieveSingleCitation(id: string, citation?:string, cslConeId?:string, opts?: HttpOptions): Observable<string> {

    return this.retrieveSingleExport(id, 'json_citation', citation, cslConeId, opts).pipe(
      map(jsonCitation => {
        return jsonCitation.records[0].data.bibliographicCitation;
      })
    )
  }

  thumbnailAvalilable(itemId: string, fileId:string, opts?: HttpOptions): Observable<boolean> {
    return this.httpHead(this.subPath + '/' + itemId + '/component/' + fileId + '/thumbnail', opts).pipe(
      map(resp => {return resp.status === 200})
    );

  }


  checkFileAudienceAccess(itemId: string, fileId: string, opts?: HttpOptions) {
    return this.httpGet(this.subPath + '/' + itemId + '/component/' + fileId + '/content', opts);
  }

  addDoi(id: string, opts?: HttpOptions): Observable<ItemVersionVO> {
    return this.httpPut(this.subPath + '/' + id + '/addNewDoi',undefined, opts);
  }

  rollback(id: string, versionNumber:number, opts?: HttpOptions): Observable<ItemVersionVO> {
    return this.httpPut(this.subPath + '/' + id + '_' + versionNumber + '/rollbackToVersion',undefined, opts);
  }

  jusReport(format: exportTypes.JUS_HTML_XML | exportTypes.JUS_INDESIGN_XML, orgId: string, year: string, opts?:HttpOptions) {
    let params: HttpParams = new HttpParams()
      .set('format', format)
      .set('orgId', orgId)
      .set('year', year);
    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params, observe:'response', responseType: 'blob'});
    return this.httpGet(this.subPath + '/jusreport', mergedOpts);

  }

  changeContext(id: string, contextId: string, opts?: HttpOptions) {
    let params: HttpParams = new HttpParams()
      .set('contextId', contextId);
    const mergedOpts = this.createOrMergeHttpOptions(opts, {params: params});
    return this.httpGet(this.subPath + '/' + id + '/changecontext', mergedOpts);
  }

  updateLocalTags(id: string, localTags: string[], opts?: HttpOptions) {

    return this.httpPut(this.subPath + '/' + id + '/localtags', localTags, opts);
  }

}
