import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlType, FormBuilderService } from '../../../services/form-builder.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { ContextDbRO, ContextDbVO, FileDbVO, ItemVersionRO, ItemVersionVO, MdsPublicationVO, Storage } from 'src/app/model/inge';
import {
  AddRemoveButtonsComponent
} from 'src/app/components/shared/add-remove-buttons/add-remove-buttons.component';
import { remove_null_empty, remove_objects } from 'src/app/utils/utils_final';
import { ChipsComponent } from 'src/app/components/shared/chips/chips.component';
import { AaService } from 'src/app/services/aa.service';
import { ContextsService } from "../../../services/pubman-rest-client/contexts.service";
import { ItemsService } from 'src/app/services/pubman-rest-client/items.service';
import { ItemListStateService } from 'src/app/components/item-list/item-list-state.service';
import { FileFormComponent } from '../file-form/file-form.component';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { FileStagingService } from 'src/app/services/pubman-rest-client/file-staging.service';
import { MessageService } from 'src/app/services/message.service';
import { itemToVersionId } from 'src/app/utils/utils';
import { ItemActionsModalComponent } from 'src/app/components/shared/item-actions-modal/item-actions-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemBadgesComponent } from "../../shared/item-badges/item-badges.component";
import { TranslatePipe } from "@ngx-translate/core";
import { BootstrapValidationDirective } from "../../../directives/bootstrap-validation.directive";
import { ValidationErrorComponent } from "../validation-error/validation-error.component";

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
    CdkDrag, ItemBadgesComponent, TranslatePipe, BootstrapValidationDirective, ValidationErrorComponent],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnInit {
//bsValidation = inject(BootstrapValidationDirective)

  aaService = inject(AaService);
  contextService = inject(ContextsService);
  fb = inject(FormBuilder);
  fbs = inject(FormBuilderService);
  fileStagingService = inject(FileStagingService);
  itemService = inject(ItemsService);
  listStateService = inject(ItemListStateService);

  messageService = inject(MessageService);
  modalService = inject(NgbModal);
  route = inject(ActivatedRoute);
  router = inject(Router);

  externalReferences!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  form!: FormGroup;
  item!: ItemVersionVO;
  form_2_submit: any;
  internalFiles!: FormArray<FormGroup<ControlType<FileDbVO>>>;
  switchFileSortingMode: boolean = false;
  user_contexts?: ContextDbRO[];

  @Output() onChangeSwitchMode: EventEmitter<any> = new EventEmitter();

  authorizationInfo: any;



  ngOnInit(): void {
    this.route.data.pipe(
      switchMap(data => {
        // console.log('Data', JSON.stringify(data));
        //this.item = data['item'];
        return of(data['item']);
      })
    ).subscribe(item => {

      this.itemUpdated(item);


      // manual Update for form validation
      //this.updateFormValidity(this.form);
    });
    this.aaService.principal.subscribe(p => {
      this.user_contexts = p.depositorContexts;
      if (!this.context.value.objectId && this.user_contexts.length > 0) {
        // no contextService call needed, because we just need a contextDbRO
        this.form.get('context')?.patchValue({ objectId: this.user_contexts[0].objectId, name: this.user_contexts[0].name });
      }
    });

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
    // console.log('Context: ', JSON.stringify(this.form.get('context')))
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
    this.internalFiles?.clear();
    this.externalReferences?.clear();
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
    // no contextService call needed, because we just need a contextDbRO
    let selectedContext = this.user_contexts?.find((context) => context.objectId == contextObjectId)
    this.form.get('context')?.patchValue({ objectId: contextObjectId, name: selectedContext?.name });
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
      if (this.aaService.isLoggedIn) {
        this.fileStagingService.createStageFile(file)
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
    if(!this.externalReferences) {
      this.externalReferences = this.fb.array([this.fbs.file_FG(null)]);
    }
    else {
      this.externalReferences.push(this.fbs.file_FG(null));
    }

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

  openActionsModal(type: 'release' | 'submit', item: ItemVersionVO) {
    const comp: ItemActionsModalComponent = this.modalService.open(ItemActionsModalComponent).componentInstance;
    comp.item = item!;
    comp.action = type;
    comp.successfullyDone.subscribe(data => {
      this.router.navigate(['/view/' + itemToVersionId(item! as ItemVersionRO)])
    })

  }

  private itemUpdated(item: ItemVersionVO) {
    this.item = item;
    this.form = this.fbs.item_FG(item);
    this.initInternalAndExternalFiles();
    if (this.form.value !== null
      && this.form.value !== undefined
      && this.form.get('objectId')?.value !== null
      && this.form.get('versionNumber')?.value !== undefined) {
      this.itemService.retrieveAuthorizationInfo(itemToVersionId(this.form.value as ItemVersionRO)).subscribe(authInfo => {
        this.authorizationInfo = authInfo;
        console.log('this.authorizationInfo: ', this.authorizationInfo);
      });
    }
  }

  get allValid() {
    return this.form.valid &&
      (this.internalFiles ? this.internalFiles.valid : true) &&
      (this.externalReferences ? this.externalReferences.valid : true)
  }

  submit(submitterId: any) {
    console.log('submitterId', typeof submitterId);
    console.log('submitterId', submitterId);

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
    // this.printValidationErrors(this.form); // call for debug function

    // submit form
    if (this.aaService.isLoggedIn) {
      if (this.form_2_submit.objectId) {
        switch (submitterId) {
          case 'save': {
            this.form.valid
              ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO)).subscribe(result => {
                this.itemUpdated(result);
                if (this.form.get('objectId')?.value) {
                  this.listStateService.itemUpdated.next(this.form.get('objectId')?.value);
                }
                this.messageService.success('Item updated successfully!');
                console.log('Updated Item:', JSON.stringify(result))
              })
              : alert('Validation Error when updating existing Publication: ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.errors));
            break;
          }
          case 'submit': {
            this.form.valid
              ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO)).subscribe((result: ItemVersionVO) => this.openActionsModal('submit', result))
              : alert('Validation Error when updating existing Publication: ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.errors));
            break;
          }
          case 'release': {
            this.form.valid
              ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO)).subscribe((result: ItemVersionVO) => this.openActionsModal('release', result))
              : alert('Validation Error when updating existing Publication: ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.errors));
            break;
          }
        }
      } else {

        switch (submitterId) {
          case 'save': {
            this.form.valid
              ? (this.itemService.create(this.form_2_submit as ItemVersionVO)).subscribe(result => {
                this.itemUpdated(result);
                if (this.form.get('objectId')?.value) {
                  this.listStateService.itemUpdated.next(this.form.get('objectId')?.value);
                }
                this.messageService.success('Item created successfully!');
                console.log('Created Item', JSON.stringify(result));
              })
              : alert('Validation Error when creating new Publication ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.valid));
            break;
          }
          case 'submit': {
            this.form.valid
              ? (this.itemService.create(this.form_2_submit as ItemVersionVO)).subscribe((result: ItemVersionVO) => this.openActionsModal('submit', result))
              : alert('Validation Error when creating new Publication ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.valid));
            break;
          }
          case 'release': {
            this.form.valid
              ? (this.itemService.create(this.form_2_submit as ItemVersionVO)).subscribe((result: ItemVersionVO) => this.openActionsModal('submit', result))
              : alert('Validation Error when creating new Publication ' + JSON.stringify(this.form.errors) + JSON.stringify(this.form.valid));
            break;
          }
        }
      }
    } else {
      alert('You must be logged in to update/create a publication');
    }
  }

  // Debugging function to print validation errors
  printValidationErrors(form: FormGroup, formField?: string) {
    console.log('Form status:', form.status, formField);
    console.log('Form errors:', form.errors);
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormGroup) {
        this.printValidationErrors(control, field);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            this.printValidationErrors(arrayControl, `${field}[${index}]`);
          } else {
            if (arrayControl?.invalid && arrayControl?.touched) {
              console.log(`Status ${field}[${index}]:`, arrayControl?.status);
              console.log(`Validation errors for ${field}[${index}]:`, arrayControl?.errors);
            }
          }
        });
      } else {
        if (control?.invalid && control?.touched) {
          console.log(`Status ${field}:`, control?.status);
          console.log(`Validation errors for ${field}:`, control?.errors);
        }
      }
    });
  }

}

/*
export interface shouldObject {
  should: {
    term?: Array<{objectid: string}>
  }
}
*/
