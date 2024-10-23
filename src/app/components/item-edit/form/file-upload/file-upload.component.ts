import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDbVO } from 'src/app/model/inge';
import { FileUploadDirective } from 'src/app/shared/directives/file-upload.directive';

@Component({
  selector: 'pure-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  files: FileDbVO[] = [{} as FileDbVO];
  fileReader: any;

  onDropFiles(files: FileDbVO[]): void {
    console.log("Event Drop Files")
    for (let file of files) {
      this.files.push(file)
    }
  }

  onChange($event:any): void {
    for (let item of $event.target.files) {
      this.files.push(item)
    }
  }

  deleteFile(f: File){
    this.files = this.files.filter(function(w){ return w.name != f.name });
  }

}
