import { Injectable } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';
import { AaService } from '../aa.service';
import { ImportLogDbVO } from "../../model/inge";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportService extends PubmanGenericRestClientService<any> {

  constructor(httpClient: HttpClient, private aaService: AaService) {
    super('/import', httpClient);
  }

  getImportLogs(): Observable<ImportLogDbVO[]> {
    return this.httpGet(this.subPath + '/' + 'getImportLogs');
  }

  getImportLogsForModerator(): Observable<ImportLogDbVO[]> {
    return this.httpGet(this.subPath + '/' + 'getImportLogsForModerator');
  }
}

