import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDbVO, Storage } from 'src/app/model/inge';
import { FileUploadDirective } from 'src/app/shared/directives/file-upload.directive';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { AaService } from 'src/app/services/aa.service';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

@Component({
  selector: 'pure-file-upload',
  standalone: true,
  imports: [CommonModule, FileUploadDirective, LoadingComponent],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  @Input() file_upload_form!: FormArray<FormGroup<ControlType<FileDbVO>>>;

  @Output() fileUploadNotice: EventEmitter<any>  = new EventEmitter();

  aaService = inject(AaService);
  fb = inject(FormBuilder);
  fbs = inject(FormBuilderService);
  fileStagingService = inject(FileStagingService);
  miscellaneousService = inject(MiscellaneousService);
  genreSpecificResource = this.miscellaneousService.genrePropertiesResource;

  files: FileDbVO[] = [{} as FileDbVO];

  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }

  onDropFiles(files: FileDbVO[]): void {
    this.fileUploadNotice.emit(files);
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
