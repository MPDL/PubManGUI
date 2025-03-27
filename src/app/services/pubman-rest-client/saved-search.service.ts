import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {PubmanGenericRestClientService} from "./pubman-generic-rest-client.service";
import {Observable} from "rxjs";
import {SavedSearchVO} from "../../model/inge";

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService extends PubmanGenericRestClientService<SavedSearchVO> {


  constructor(httpClient: HttpClient) {
    super('/savedSearches');
  }

  getAllSearch(authenticate? : boolean): Observable<SavedSearchVO[]>{
    const path = this.subPath;
    return this.httpGet(path, authenticate);

  }

}
