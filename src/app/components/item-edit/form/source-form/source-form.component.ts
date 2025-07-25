import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AddRemoveButtonsComponent
} from '../../../shared/add-remove-buttons/add-remove-buttons.component';
import { AltTitleFormComponent } from '../alt-title-form/alt-title-form.component';
import { ControlType, FormBuilderService } from '../../../../services/form-builder.service';
import { AlternativeTitleVO, CreatorVO, IdentifierVO, MdsPublicationGenre, PublishingInfoVO } from 'src/app/model/inge';
import { CreatorFormComponent } from '../creator-form/creator-form.component';
import { PublishingInfoFormComponent } from '../publishing-info-form/publishing-info-form.component';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { Errors } from 'src/app/model/errors';

@Component({
  selector: 'pure-source-form',
  standalone: true,
  imports: [AddRemoveButtonsComponent,
    AltTitleFormComponent,
    CommonModule,
    CreatorFormComponent,
    IdentifierFormComponent,
    PublishingInfoFormComponent,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './source-form.component.html',
  styleUrl: './source-form.component.scss'
})
export class SourceFormComponent {
  @Input() source_form!: FormGroup;
  @Input() index!: number;
  @Input() index_length!: number;
  @Output() notice = new EventEmitter();

  fbs = inject(FormBuilderService);
  miscellaneousService = inject(MiscellaneousService);
  genrePropertiesResource  = this.miscellaneousService.genrePropertiesResource;

  error_types = Errors;
  genre_types = Object.keys(MdsPublicationGenre);

  get alternativeTitles() {
    return this.source_form.get('alternativeTitles') as FormArray<FormGroup<ControlType<AlternativeTitleVO>>>;
  }

  get creators() {
    return this.source_form.get('creators') as FormArray<FormGroup<ControlType<CreatorVO>>>;
  }

  get identifiers() {
    return this.source_form.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  get publishingInfo() {
    return this.source_form.get('publishingInfo') as FormGroup<ControlType<PublishingInfoVO>>;
  }

  add_remove_source(event: any) {
    this.notice.emit(event);
  }

  genre_change(event: any) {
    console.log('changed genre', event.target.value)
  }

  handleAltTitleNotification(event: any) {
    if (event.action === 'add') {
      this.addAltTitle(event.index);
    } else if (event.action === 'remove') {
      this.removeAltTitle(event.index);
    }
  }

  addAltTitle(index: number) {
    this.alternativeTitles.insert(index + 1, this.fbs.alt_title_FG(null));
  }

  removeAltTitle(index: number) {
    this.alternativeTitles.removeAt(index);
  }

  handleCreatorNotification(event: any) {
    if (event.action === 'add') {
      this.addCreator(event.index);
    } else if (event.action === 'remove') {
      this.removeCreator(event.index);
    }
  }

  handleNoCreators() {
    this.creators.push(this.fbs.creator_FG(null));
  }

  addCreator(index: number) {
    // console.log('current index', index, 'length', this.creators.length)
    this.creators.insert( index + 1, this.fbs.creator_FG(null));
  }

  dropCreator(event: CdkDragDrop<string[]>) {
    this.moveItemInArray(this.creators, event.previousIndex, event.currentIndex);
  }

  removeCreator(index: number) {
    this.creators.removeAt(index);
  }

  handleIdentifierNotification(event: any) {
    if (event.action === 'add') {
      this.addIdentifier(event.index);
    } else if (event.action === 'remove') {
      this.removeIdentifier(event.index);
    }
  }

  handleNoIdentifiers() {
    this.identifiers.push(this.fbs.identifier_FG(null));
  }

  addIdentifier(index: number) {
    this.identifiers.insert( index + 1, this.fbs.identifier_FG(null));
  }

  removeIdentifier(index: number) {
    this.identifiers.removeAt(index);
  }

  /** Copied from Angular CDK to make our FormArrays work with drag and drop */
  moveItemInArray<T = any>(array: FormArray<FormGroup<ControlType<T>>>, fromIndex: number, toIndex: number): void {
    let object:any = array.at(fromIndex);
    array.removeAt(fromIndex);
    array.insert(toIndex, object);
  }

}
