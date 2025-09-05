import { Injectable } from '@angular/core';
import { FileDbVO } from 'src/app/model/inge';
import { HttpOptions, PubmanGenericRestClientService } from './pubman-generic-rest-client.service';
import { Observable, switchMap, tap } from 'rxjs';
import { HttpEvent } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileStagingService extends PubmanGenericRestClientService<FileDbVO>{

  constructor() {
    super('/staging');
  }

  createStageFile(file: File) : Observable<HttpEvent<string>> {
    // console.log('trying to stage file');

    return this.fileToByteStream(file).pipe(
      switchMap(arrayBuffer => {
        return super.httpPostAny(this.subPath + '/' + file.name, arrayBuffer, {observe:'events', reportProgress:true});
        }
      )
    );

  }

  fileToByteStream(file: File): Observable<ArrayBuffer> {
    return new Observable( observer => {

        const reader = new FileReader();
        reader.onload = () => {
          const data = reader.result as ArrayBuffer;

          observer.next(data);
          observer.complete();

        };
        reader.onerror = () => observer.error(reader.error);
        reader.readAsArrayBuffer(file);
      }
    )}
}
