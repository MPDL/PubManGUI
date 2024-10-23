import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    OptionDirective],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  fbs = inject(FormBuilderService);
  route = inject(ActivatedRoute);
  aaService = inject(AaService);
  contextService = inject(ContextsService);
  itemService = inject(ItemsService)
  form!: FormGroup;
  form_2_submit: any;
  user_contexts?: ContextDbRO[];

  ngOnInit(): void {
    this.route.data.pipe(
      switchMap(data => {
        return of(this.fbs.item_FG(data['item']));
      })
    ).subscribe(f => {
      this.form = f;
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

  /*
  addTag() {
    this.localTags.push(new FormControl());
  }

  removeTag(index: number) {
    this.localTags.removeAt(index);
  }
  */

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

  handleNotification(event: any) {
    alert(event);
  }

  submit() {
    this.form_2_submit = remove_null_empty(this.form.value);
    this.form_2_submit = remove_objects(this.form_2_submit);
    if (this.aaService.isLoggedIn && this.aaService.token) {
      if (this.form_2_submit.objectId) {
        this.form.valid ? (this.itemService.update(this.form_2_submit.objectId, this.form_2_submit as ItemVersionVO, this.aaService.token)) : alert(JSON.stringify(this.form.errors));
      } else {
        this.form.valid ? (this.itemService.create(this.form_2_submit as ItemVersionVO, this.aaService.token)).subscribe(result => console.log('Result', JSON.stringify(result))) : alert('ERROR: ' + JSON.stringify(this.form.errors));
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
