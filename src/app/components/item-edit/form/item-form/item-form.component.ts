import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MetadataFormComponent } from '../metadata-form/metadata-form.component';
import { ContextDbRO, ContextDbVO, MdsPublicationVO } from 'src/app/model/inge';
import { SelectorComponent } from 'src/app/shared/components/selector/selector.component';
import { PureCtxsDirective } from 'src/app/shared/components/selector/services/pure_ctxs/pure-ctxs.directive';
import { OptionDirective } from 'src/app/shared/components/selector/directives/option.directive';
import { AddRemoveButtonsComponent } from '../add-remove-buttons/add-remove-buttons.component';
import { remove_null_empty, remove_objects } from 'src/app/shared/services/utils_final';
import { ChipsComponent } from 'src/app/shared/components/chips/chips.component';
import { AaService } from 'src/app/services/aa.service';
import {ContextsService} from "../../../../services/pubman-rest-client/contexts.service";

@Component({
  selector: 'pure-item-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ChipsComponent, MetadataFormComponent, AddRemoveButtonsComponent, SelectorComponent, PureCtxsDirective, OptionDirective],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  fbs = inject(FormBuilderService);
  route = inject(ActivatedRoute);
  aaService = inject(AaService);
  contextService = inject(ContextsService);
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

  handleNotification(event: any) {
    alert(event);
  }

  submit() {
    this.form_2_submit = remove_null_empty(this.form.value);
    this.form_2_submit = remove_objects(this.form_2_submit);
    // this.form.patchValue(final_form);
    this.form.valid ? alert('done!') : alert(JSON.stringify(this.form.errors));
  }
}

/*
export interface shouldObject {
  should: {
    term?: Array<{objectid: string}>
  }
}
*/
