import { Injectable } from '@angular/core';
import { FileDbVO } from 'src/app/model/inge';
import { HttpOptions, PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileStagingService extends PubmanGenericRestClientService<FileDbVO>{

  constructor() {
    super('/staging');
  }

  createStageFile(file: FileDbVO, opts?: HttpOptions) : Observable<String> {
    // console.log('trying to stage file');
    return super.httpPost(this.subPath + '/' + file.name, file.content, opts);
  }
}
