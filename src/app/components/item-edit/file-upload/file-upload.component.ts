import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadDirective } from 'src/app/directives/file-upload.directive';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { forkJoin, Observable, of, tap } from "rxjs";
import { HttpEventType } from "@angular/common/http";
import { filter, map } from "rxjs/operators";

@Component({
  selector: 'pure-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {



  @Output() fileUploadNotice: EventEmitter<UploadedFile[]>  = new EventEmitter();

  stagingFileService = inject(FileStagingService);

  onDropFiles(fileList: FileList | undefined): void {
    this.upload(fileList);
  }

  onChange($event: any): void {
    let files = $event.target.files;
    this.upload(files);
    $event.target.value = '';
  }

  upload(fileList: FileList | undefined) {
    if(fileList) {

      const uploadObservables = Array.from(fileList).map(file =>
        this.stagingFileService.createStageFile(file).pipe(
          tap(stageFileEvent => {
            console.log(stageFileEvent.type);
            //console.log(stageFileEvent);
            if(stageFileEvent.type === HttpEventType.DownloadProgress) {
              console.log("DownloadProg");
              console.log(stageFileEvent.loaded + " / " + stageFileEvent.total);
            }
            if(stageFileEvent.type === HttpEventType.UploadProgress) {
              console.log("Upload Progress");
              console.log(stageFileEvent.loaded + " / " + stageFileEvent.total);
            }
          }),
          filter(stageFileEvent => stageFileEvent.type === HttpEventType.Response),
          map(stageFileEvent => {
            const uploadedFile: UploadedFile = {stagingId : stageFileEvent.body!, name : file.name};
            return uploadedFile;
          })
        )
      );


      forkJoin(uploadObservables).pipe(
        tap(uploadedFiles => {
          this.fileUploadNotice.emit(uploadedFiles);
        })
      ).subscribe();
    }
    //return of([]);
  }

}

export interface UploadedFile {
  stagingId: string
  name: string
}
