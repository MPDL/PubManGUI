import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { ContextDbRO, ContextDbVO, FileDbVO, ItemVersionVO, MdsPublicationVO } from 'src/app/model/inge';
import { SelectorComponent } from 'src/app/shared/components/selector/selector.component';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { OptionDirective } from 'src/app/shared/components/selector/directives/option.directive';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { remove_null_empty, remove_objects } from 'src/app/shared/services/utils_final';
import { ChipsComponent } from 'src/app/shared/components/chips/chips.component';
import { AaService } from 'src/app/services/aa.service';
import { ContextsService } from "../../../../services/pubman-rest-client/contexts.service";
import { ItemsService } from 'src/app/services/pubman-rest-client/items.service';
import { FileFormComponent } from '../file-form/file-form.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FilterFilesPipe } from 'src/app/shared/services/pipes/filter-files.pipe';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

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
    SelectorComponent,
    PureCtxsDirective,
    OptionDirective,
    FilterFilesPipe,
    CdkDropList,
    CdkDrag],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnInit {

  fb = inject(FormBuilder);
  fbs = inject(FormBuilderService);
  route = inject(ActivatedRoute);
  aaService = inject(AaService);
  contextService = inject(ContextsService);
  itemService = inject(ItemsService)
  form!: FormGroup;
  form_2_submit: any;
  user_contexts?: ContextDbRO[];
  internalFiles!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  externalReferences!: FormArray<FormGroup<ControlType<FileDbVO>>>;

  switchFileSortingMode: boolean = false;

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

  get localTags() {
    return this.form.get('localTags') as FormArray<FormControl<ControlType<string>>>
  }

  get metadata_form() {
    return this.form.get('metadata') as FormGroup<ControlType<MdsPublicationVO>>
  }

  get files() {
    return this.form.get('files') as FormArray<FormGroup<ControlType<FileDbVO>>>;
  }

  get context() {
    console.log('Context: ', JSON.stringify(this.form.get('context')))
    return this.form.get('context') as FormGroup<ControlType<ContextDbVO>>
  }

  get message() {
    return this.form.get('message') as FormControl<ControlType<string>>
  }

  initInternalAndExternalFiles() {
    for (let i = 0; i < this.files.length; i++) {
      console.log('init File', i);
      if (this.files.at(i).value.storage == 'INTERNAL_MANAGED') {
        console.log('internal file added', i);
        if (!this.internalFiles) {
          this.internalFiles = this.fb.array([this.fbs.file_FG(this.files.at(i).value as FileDbVO)]);
        } else {
          this.internalFiles.push(this.files.at(i));
        }
      }
      if (this.files.at(i).value.storage == 'EXTERNAL_URL') {
        if (!this.externalReferences) {
          this.externalReferences = this.fb.array([this.fbs.file_FG(this.files.at(i).value as FileDbVO)]);
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
    //this.onChangeSwitchMode.emit({switchfileSortingMode: this.switchFileSortingMode});
    console.log("IN SORTING MODE");
    const elements = (document.getElementsByClassName('containerHideOnSort')) as any
    //elements.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    console.log("this.switchFileSortingMode", this.switchFileSortingMode);
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

  handleFileNotification(event: any) {
    if (event.action === 'add') {
      this.addFile(event.index);
    } else if (event.action === 'remove') {
      this.removeFile(event.index);
    }
  }

  handleNoFiles() {
    this.files.push(this.fbs.file_FG(null));
  }

  addFile(index: number) {
    this.files.insert(index + 1, this.fbs.file_FG(null));
  }

  removeFile(index: number) {
    this.files.removeAt(index);
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
    this.internalFiles.controls.forEach(internalFileControl => {
      this.files.push(internalFileControl);
    })
    this.externalReferences.controls.forEach(externalReferenceControl => {
      this.files.push(externalReferenceControl);
    })
    // set sorting (sortkz) for files
    for (let i = 0; i < this.files.length; i++) {
      console.log("Setting new sortkz: ", i);
      this.files.at(i).get('sortkz')?.setValue(i);
      console.log("Setting new sortkz: ", this.files.at(i).get('sortkz'));
    }
    // cleanup form
    this.form_2_submit = remove_null_empty(this.form.value);
    this.form_2_submit = remove_objects(this.form_2_submit);
    if (this.aaService.isLoggedIn && this.aaService.token) {
      if (this.form_2_submit.objectId) {
        this.form.valid ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO, this.aaService.token)).subscribe(result => console.log('Updated Item:', JSON.stringify(result))) : alert(JSON.stringify(this.form.errors));
      } else {
        this.form.valid ? (this.itemService.create(this.form_2_submit as ItemVersionVO, this.aaService.token)).subscribe(result => console.log('Created Item', JSON.stringify(result))) : alert('ERROR: ' + JSON.stringify(this.form.errors));
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