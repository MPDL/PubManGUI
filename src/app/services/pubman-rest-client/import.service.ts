import { inject, Injectable, signal } from '@angular/core';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';
import { AaService } from '../aa.service';
import {ImportLogDbVO} from "../../model/inge";

@Injectable({
  providedIn: 'root'
})
export class ImportService extends PubmanGenericRestClientService<any> {


  private aaService = inject(AaService);

  constructor(aaService: AaService) {
    super('/import');
  }

  getImportLogs(): Observable<ImportLogDbVO[]> {
    return this.httpGet(this.subPath + '/' + 'getImportLogs');
  }

  getImportLogsForModerator(): Observable<ImportLogDbVO[]> {
    return this.httpGet(this.subPath + '/' + 'getImportLogsForModerator');
  }
}

