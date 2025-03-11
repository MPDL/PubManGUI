import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { ContextDbRO, ContextDbVO, FileDbVO, ItemVersionVO, MdsPublicationVO, Storage } from 'src/app/model/inge';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { remove_null_empty, remove_objects } from 'src/app/shared/services/utils_final';
import { ChipsComponent } from 'src/app/shared/components/chips/chips.component';
import { AaService } from 'src/app/services/aa.service';
import { ContextsService } from "../../../../services/pubman-rest-client/contexts.service";
import { ItemsService } from 'src/app/services/pubman-rest-client/items.service';
import { FileFormComponent } from '../file-form/file-form.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'pure-item-form',
  standalone: true,
  imports: [CommonModule,
    FileFormComponent,
    FileUploadComponent,
    FormsModule,
    ReactiveFormsModule,
    ChipsComponent,
    MetadataFormComponent,
    AddRemoveButtonsComponent,
    CdkDropList,
    CdkDrag],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnInit {

  aaService = inject(AaService);
  contextService = inject(ContextsService);
  fb = inject(FormBuilder);
  fbs = inject(FormBuilderService);
  fileStagingService = inject(FileStagingService);
  itemService = inject(ItemsService);
  messageService = inject(MessageService);
  route = inject(ActivatedRoute);
  
  externalReferences!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  form!: FormGroup;
  form_2_submit: any;
  internalFiles!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  switchFileSortingMode: boolean = false;
  user_contexts?: ContextDbRO[];

  @Output() onChangeSwitchMode: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.route.data.pipe(
      switchMap(data => {
        return of(this.fbs.item_FG(data['item']));
      })
    ).subscribe(f => {
      this.form = f;
      this.initInternalAndExternalFiles();
    });
    this.aaService.principal.subscribe(
      p => {
        this.user_contexts = p.depositorContexts;
      }
    )
    /*
    this.contextService.getDepositorContextsForCurrentUser()
      .subscribe(
        contexts => {
          this.user_contexts = contexts.records.map(sr => sr.data); console.log('UserContexts: ' + JSON.stringify(this.user_contexts))
        }
      );

     */
  }

  get context() {
    console.log('Context: ', JSON.stringify(this.form.get('context')))
    return this.form.get('context') as FormGroup<ControlType<ContextDbVO>>
  }

  get files() {
    return this.form.get('files') as FormArray<FormGroup<ControlType<FileDbVO>>>;
  }

  get localTags() {
    return this.form.get('localTags') as FormArray<FormControl<ControlType<string>>>
  }

  get metadata_form() {
    return this.form.get('metadata') as FormGroup<ControlType<MdsPublicationVO>>
  }

  get message() {
    return this.form.get('message') as FormControl<ControlType<string>>
  }

  initInternalAndExternalFiles() {
    for (let i = 0; i < this.files.length; i++) {
      if (this.files.at(i).value.storage == 'INTERNAL_MANAGED') {
        if (!this.internalFiles) {
          this.internalFiles = this.fb.array([this.files.at(i)]);
        } else {
          this.internalFiles.push(this.files.at(i));
        }
      }
      if (this.files.at(i).value.storage == 'EXTERNAL_URL') {
        if (!this.externalReferences) {
          this.externalReferences = this.fb.array([this.files.at(i)]);
        } else {
          this.externalReferences.push(this.files.at(i));
        }
      }
    }
  }

  add_remove_local_tag(event: any) {
    if (event.action === 'add') {
      this.localTags.insert(event.index + 1, new FormControl());
    } else if (event.action === 'remove') {
      this.localTags.removeAt(event.index);
    }
  }

  context_change(contextObjectId: string) {
    let selecteContext = this.user_contexts?.find((context) => context.objectId == contextObjectId)
    this.form.get('context')?.patchValue({ objectId: contextObjectId, name: selecteContext?.name });
  }

  changeSortingMode() {
    this.switchFileSortingMode = !this.switchFileSortingMode;
    const elements = (document.getElementsByClassName('containerHideOnSort')) as any
    if (this.switchFileSortingMode == true) {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none'
      }
    } else {
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'block';
      }
    }

  }

  handleFileUploadNotification(files: FileDbVO[]) {
    for (let file of files) {
      file.storage = Storage.INTERNAL_MANAGED;
      if (this.aaService.token) {
        this.fileStagingService.createStageFile(file, this.aaService.token)
          .subscribe(stagedFileId => {
            file.content = stagedFileId.toString();
            if (!this.internalFiles) {
              this.internalFiles = this.fb.array([this.fbs.file_FG(file)]);
            } else {
              this.internalFiles.push(this.fbs.file_FG(file));
            }
          })

      } else {
        this.messageService.error('Authentication error. You need to be logged in, to stage a file');
      }
    }
  }

  handleInternalFileNotification(event: any) {
    if (event.action === 'add') {
      this.addInternalFile(event.index);
    } else if (event.action === 'remove') {
      this.removeInternalFile(event.index);
    }
  }

  handleNoInternalFiles() {
    this.internalFiles.push(this.fbs.file_FG(null));
  }

  addInternalFile(index: number) {
    this.internalFiles.insert(index + 1, this.fbs.file_FG(null));
  }

  removeInternalFile(index: number) {
    this.internalFiles.removeAt(index);
  }

  handleExternalReferenceNotification(event: any) {
    if (event.action === 'add') {
      this.addExternalReference(event.index);
    } else if (event.action === 'remove') {
      this.removeExternalReference(event.index);
    }
  }

  handleNoExternalReferences() {
    this.externalReferences.push(this.fbs.file_FG(null));
  }

  addExternalReference(index: number) {
    this.externalReferences.insert(index + 1, this.fbs.file_FG(null));
  }

  removeExternalReference(index: number) {
    this.externalReferences.removeAt(index);
  }

  handleNotification(event: any) {
    alert(event);
  }

  /*
  onDragMove(event: CdkDragMove<any>): void {
    const elements=(document.getElementsByClassName('containerHideOnDrag'))as any
    //elements.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    for (let i=0; i<elements.length; i++) {
      elements[i].style.display = 'none'
    }
  }
  */

  dropInternalFiles(event: CdkDragDrop<string[]>) {
    this.moveItemInArray(this.internalFiles, event.previousIndex, event.currentIndex);
    /*
    const elements=(document.getElementsByClassName('containerHideOnDrag'))as any
    for (let i=0; i<elements.length; i++) {
      elements[i].style.display = 'block';
    }
    */
  }

  dropExternalReferences(event: CdkDragDrop<string[]>) {
    this.moveItemInArray(this.internalFiles, event.previousIndex, event.currentIndex);
  }

  /** Copied from Angular CDK to make our FormArrays work with drag and drop */
  moveItemInArray<T = any>(array: FormArray<FormGroup<ControlType<T>>>, fromIndex: number, toIndex: number): void {
    let object: any = array.at(fromIndex);
    array.removeAt(fromIndex);
    array.insert(toIndex, object);
  }

  submit() {
    // reassembling files in "files" from "internalFiles" and externalReferences 
    this.files.clear();
    if (this.internalFiles) {
      this.internalFiles.controls.forEach(internalFileControl => {
        this.files.push(internalFileControl);
      })
    }
    if (this.externalReferences) {
      this.externalReferences.controls.forEach(externalReferenceControl => {
        this.files.push(externalReferenceControl);
      });
    }
    // set sorting (sortkz) for files
    for (let i = 0; i < this.files.length; i++) {
      //console.log("Setting new sortkz: ", i);
      this.files.at(i).get('sortkz')?.setValue(i);
      //console.log("Setting new sortkz: ", this.files.at(i).get('sortkz'));
    }
    // cleanup form
    this.form_2_submit = remove_null_empty(this.form.value);
    this.form_2_submit = remove_objects(this.form_2_submit);
/*
    console.log('form_2_submit.valid:', JSON.stringify(this.form_2_submit.valid));
    console.log('form_2_submit.errors:', JSON.stringify(this.form_2_submit.errors));
    console.log('form.valid', JSON.stringify(this.form.valid));
    console.log('form.errors:', JSON.stringify(this.form.errors));
*/
    // submit form

    if (this.aaService.isLoggedIn && this.aaService.token) {
      if (this.form_2_submit.objectId) {
        this.form.errors == null ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO, this.aaService.token)).subscribe(result => console.log('Updated Item:', JSON.stringify(result))) : alert('Validation Error when updating existing Publication: ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.errors));
      } else {
        this.form.errors == null ? (this.itemService.create(this.form_2_submit as ItemVersionVO, this.aaService.token)).subscribe(result => console.log('Created Item', JSON.stringify(result))) : alert('Validation Error when creating new Publication ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.valid));
      }
    }

  }
}

/*
export interface shouldObject {
  should: {
    term?: Array<{objectid: string}>
  }
}
*/