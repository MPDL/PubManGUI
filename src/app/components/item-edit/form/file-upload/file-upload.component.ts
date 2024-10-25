import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDbVO, Storage } from 'src/app/model/inge';
import { FileUploadDirective } from 'src/app/shared/directives/file-upload.directive';
import { FormArray, FormGroup } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';

@Component({
  selector: 'pure-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadDirective],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  @Input() file_upload_form!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  
  fbs = inject(FormBuilderService);
  
  files: FileDbVO[] = [{} as FileDbVO];
  fileReader: any;

  onDropFiles(files: FileDbVO[]): void {
    console.log("Event Drop Files")
    for (let file of files) {
      file.storage = Storage.INTERNAL_MANAGED;
      this.file_upload_form.push(this.fbs.file_FG(file))
    }
  }

  /*
  onDropFiles(files: FileDbVO[]): void {
    console.log("Event Drop Files")
    for (let file of files) {
      this.files.push(file)
    }
  }
  */

  onChange($event:any): void {
    for (let file of $event.target.files) {
        file.storage = Storage.INTERNAL_MANAGED;
        this.file_upload_form.push(this.fbs.file_FG(file))
      }
  }

  deleteFile(f: File){
    // this.files = this.files.filter(function(w){ return w.name != f.name });
    this.file_upload_form.controls = this.file_upload_form.controls.filter(function(w){ return w.controls.name.value != f.name });
  }

}