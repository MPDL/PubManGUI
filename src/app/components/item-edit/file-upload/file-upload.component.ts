import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadDirective } from 'src/app/directives/file-upload.directive';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { catchError, finalize, forkJoin, Observable, of, tap } from "rxjs";
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

  transferringFilesMap : Map<string, TransferringFile> = new Map();

  uploadInProgress = false;

  onDropFiles(fileList: FileList | undefined): void {
    this.upload(fileList);
  }

  onChange($event: any): void {
    let files = $event.target.files;
    this.upload(files);
    $event.target.value = '';
  }

  upload(fileList: FileList | undefined) {
    this.transferringFilesMap.clear();
    if(fileList) {

      const fileArray = Array.from(fileList);

      fileArray.forEach(file => {

        const tf: TransferringFile = {
          file: file,
          loaded: 0,
          total: file.size,
          percentage: 0,
          finished: false
        }
        this.transferringFilesMap.set(file.name, tf);
      })

      this.uploadInProgress = true;
      const uploadObservables = fileArray.map(file =>
        this.stagingFileService.createStageFile(file).pipe(

          tap(stageFileEvent => {
            //console.log(stageFileEvent.type);
            //console.log(stageFileEvent);
            if(stageFileEvent.type === HttpEventType.DownloadProgress) {
              //console.log("DownloadProg");
              //console.log(stageFileEvent.loaded + " / " + stageFileEvent.total);
            }
            if(stageFileEvent.type === HttpEventType.UploadProgress) {
              const tf = this.transferringFilesMap.get(file.name)!;
              tf.loaded = stageFileEvent.loaded;
              if (stageFileEvent.total) {
                tf.total = stageFileEvent.total;
              }
              this.transferringFilesMap.get(file.name)!.percentage = Math.round((tf.loaded / tf.total) * 100);


              //console.log("Upload Progress");
              //console.log(stageFileEvent.loaded + " / " + stageFileEvent.total);
            }
          }),
          filter(stageFileEvent => stageFileEvent.type === HttpEventType.Response),
          map(stageFileEvent => {
            const uploadedFile: UploadedFile = {stagingId : stageFileEvent.body!, name : file.name};
            return uploadedFile;
          }),
          finalize(() => {
            this.transferringFilesMap.get(file.name)!.finished = true;
          })
        )
      );


      forkJoin(uploadObservables).pipe(
        tap(uploadedFiles => {
          this.fileUploadNotice.emit(uploadedFiles);
        }),
        catchError(err => {
          return [];
        }),
        finalize(() => {
          this.uploadInProgress = false;
        })
      ).subscribe();
    }
    //return of([]);
  }

  protected readonly Math = Math;
}

export interface UploadedFile {
  stagingId: string
  name: string
}

export interface TransferringFile {
  file: File,
  error?: any,
  loaded: number,
  total: number,
  percentage: number,
  finished: boolean
}
