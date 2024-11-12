import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDbVO, Storage } from 'src/app/model/inge';
import { FileUploadDirective } from 'src/app/shared/directives/file-upload.directive';
import { FormArray, FormGroup } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { AaService } from 'src/app/services/aa.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { Observable } from 'rxjs';

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
  fileStagingService = inject(FileStagingService);
  aaService = inject(AaService);
  messageService = inject(MessageService)

  files: FileDbVO[] = [{} as FileDbVO];
  fileReader: any;

  onDropFiles(files: FileDbVO[]): void {
    console.log("Event Drop Files")
    for (let file of files) {
      file.storage = Storage.INTERNAL_MANAGED;
      if (this.aaService.token) {
        this.fileStagingService.createStageFile(file, this.aaService.token)
          .subscribe(stagedFileId => {
            file.content = stagedFileId.toString();
            this.file_upload_form.push(this.fbs.file_FG(file));
          })

      } else {
        this.messageService.error('Authentication error. You need to be logged in, to stage a file');
      }
    }
  }


  onChange($event: any): void {
    for (let file of $event.target.files) {
      file.storage = Storage.INTERNAL_MANAGED;
      this.file_upload_form.push(this.fbs.file_FG(file))
    }
  }


  deleteFile(f: File) {
    // this.files = this.files.filter(function(w){ return w.name != f.name });
    this.file_upload_form.controls = this.file_upload_form.controls.filter(function (w) { return w.controls.name.value != f.name });
  }

}