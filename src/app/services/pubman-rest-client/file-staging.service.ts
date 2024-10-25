import { Injectable } from '@angular/core';
import { StagedFileDbVO } from 'src/app/model/inge';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';

@Injectable({
  providedIn: 'root'
})
export class FileStagingService extends PubmanGenericRestClientService<StagedFileDbVO>{

  constructor() {
    super('/staging');
  }
}
