import { Injectable } from '@angular/core';
import { FileDbVO } from 'src/app/model/inge';
import { PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileStagingService extends PubmanGenericRestClientService<FileDbVO>{

  constructor() {
    super('/staging');
  }

  createStageFile(file: FileDbVO, token: string) : Observable<String> {
    // console.log('trying to stage file');
    return super.httpPost(this.subPath + '/' + file.name, file.content, token);
  }
}
