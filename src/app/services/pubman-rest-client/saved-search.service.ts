import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { HttpOptions, PubmanGenericRestClientService } from "./pubman-generic-rest-client.service";
import { Observable } from "rxjs";
import { SavedSearchVO } from "../../model/inge";

@Injectable({
  providedIn: 'root'
})
export class SavedSearchService extends PubmanGenericRestClientService<SavedSearchVO> {


  constructor(httpClient: HttpClient) {
    super('/savedSearches');
  }

  getAllSearch(opts?: HttpOptions): Observable<SavedSearchVO[]>{
    const path = this.subPath;
    return this.httpGet(path, opts);

  }

}
