import { Injectable, inject } from '@angular/core';
import {Observable, map, EMPTY} from 'rxjs';
import { AaService } from 'src/app/services/aa.service';
import {PubmanGenericRestClientService, SearchResult} from "./pubman-generic-rest-client.service";
import {AccountUserDbVO, ContextDbVO} from "../../model/inge";
import {PubmanSearchableGenericRestClientService} from "./pubman-searchable-generic-rest-client.service";
import {baseElasticSearchQueryBuilder} from "../../shared/services/search-utils";

@Injectable({
  providedIn: 'root'
})
export class ContextsService extends PubmanSearchableGenericRestClientService<ContextDbVO>{

  static instance: ContextsService;

  constructor() {
    super('/contexts');
    ContextsService.instance = this;
  }


  openContext(context: ContextDbVO, token: string): Observable<ContextDbVO> {
    const path = this.subPath + '/' + context.objectId + '/open';
    const body = context.lastModificationDate;
    return this.httpPut(path, context, token);

  }

  closeContext(context: ContextDbVO, token: string): Observable<ContextDbVO> {
    const path = this.subPath + '/' + context.objectId + '/close';
    const body = context.lastModificationDate;
    return this.httpPut(path, context, token);
  }

  getContextsForCurrentUser(role:string, user:AccountUserDbVO, token:string) {
    //let token = this.aaService.token ? this.aaService.token : undefined;
    //let user: AccountUserDbVO = this.aaService.user;
    let should: any [] = []
    let body = {
      query: {
        bool: {
          should
        }
      }
    };
    var termCounter = 0;
    for (var i = 0; i < user.grantList.length; i++) {
      var grant = user.grantList[i];
      console.log("userGrantType: " + grant.grantType
        + " | userGrantObjectRef: " + grant.objectRef
        + " | userGrantObjectRole: " + grant.role);
      if (grant.role === role) {
        body.query.bool.should.push({"term" : {"objectId" : grant.objectRef}})
      }
    }

    console.log('Body: ' + JSON.stringify(body));
    console.log('Token: ' + token);
    if(body.query.bool.should.length) {
      return (this.search(body, token));
    }
    else return EMPTY;
  }



}
