import { Component, EventEmitter, Input, Output, computed, effect, inject, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlType, FormBuilderService } from '../../services/form-builder.service';
import { AbstractVO, AlternativeTitleVO, CreatorVO, EventVO, IdentifierVO, LegalCaseVO, MdsPublicationGenre, ProjectInfoVO, PublishingInfoVO, ReviewMethod, SourceVO, SubjectVO } from 'src/app/model/inge';
import { AltTitleFormComponent } from '../alt-title-form/alt-title-form.component';
import { CreatorFormComponent } from '../creator-form/creator-form.component';
import { AddRemoveButtonsComponent } from '../../../../shared/components/add-remove-buttons/add-remove-buttons.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { LanguageFormComponent } from '../language-form/language-form.component';
import { LegalCaseFormComponent } from '../legal-case-form/legal-case-form.component';
import { IdentifierFormComponent } from '../identifier-form/identifier-form.component';
import { PublishingInfoFormComponent } from '../publishing-info-form/publishing-info-form.component';
import { SourceFormComponent } from '../source-form/source-form.component';
import { SubjectFormComponent } from '../subject-form/subject-form.component';
import { AbstractFormComponent } from '../abstract-form/abstract-form.component';
import { ProjectInfoFormComponent } from '../project-info-form/project-info-form.component';
import { CdkDragDrop, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { MiscellaneousService } from 'src/app/services/pubman-rest-client/miscellaneous.service';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

@Component({
  selector: 'pure-metadata-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbstractFormComponent,
    AddRemoveButtonsComponent,
    AltTitleFormComponent,
    CreatorFormComponent,
    EventFormComponent,
    IdentifierFormComponent,
    LanguageFormComponent,
    LegalCaseFormComponent,
    LoadingComponent,
    PublishingInfoFormComponent,
    SourceFormComponent,
    SubjectFormComponent,
    ProjectInfoFormComponent,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './metadata-form.component.html',
  styleUrls: ['./metadata-form.component.scss']
})
export class MetadataFormComponent {

  @Input() meta_form!: FormGroup;
  @Output() notice = new EventEmitter();

  fbs = inject(FormBuilderService);
  miscellaneousService = inject(MiscellaneousService);
  genreSpecificResource = this.miscellaneousService.genrePropertiesResource;

  genre_types = Object.keys(MdsPublicationGenre);
  review_method_types = Object.keys(ReviewMethod);

  constructor(
    private fb: FormBuilder,
  ) { 
  }

  ngOnInit() {
    let genre = this.meta_form.get('genre')?.value ? this.meta_form.get('genre')?.value : undefined;
    console.log('Genre', genre)
    this.miscellaneousService.selectedGenre.set(genre);
    console.log('metadata-form GenreSpecificProperties', this.miscellaneousService.genreSpecficProperties());
  }

  get alternativeTitles() {
    return this.meta_form.get('alternativeTitles') as FormArray<FormGroup<ControlType<AlternativeTitleVO>>>;
  }

  get creators() {
    return this.meta_form.get('creators') as FormArray<FormGroup<ControlType<CreatorVO>>>;
  }

  get event() {
    return this.meta_form.get('event') as FormGroup<ControlType<EventVO>>;
  }

  
  get identifiers() {
    return this.meta_form.get('identifiers') as FormArray<FormGroup<ControlType<IdentifierVO>>>;
  }

  get languages() {
    return this.meta_form.get('languages') as FormArray<FormControl>;
  }

  get legalCase() {
    return this.meta_form.get('legalCase') as FormGroup<ControlType<LegalCaseVO>>;
  }

  get publishingInfo() {
    return this.meta_form.get('publishingInfo') as FormGroup<ControlType<PublishingInfoVO>>;
  }

  get sources() {
    return this.meta_form.get('sources') as FormArray<FormGroup<ControlType<SourceVO>>>;
  }

  get subjects() {
    return this.meta_form.get('subjects') as FormArray<FormGroup<ControlType<SubjectVO>>>;
  }

  get abstracts() {
    return this.meta_form.get('abstracts') as FormArray<FormGroup<ControlType<AbstractVO>>>;
  }

  get projectInfo() {
    return this.meta_form.get('projectInfo') as FormArray<FormGroup<ControlType<ProjectInfoVO>>>;
  }
/*
  get genreSpecificProperties() {
    return this.miscellaneousService.genreSpecficProperties();
  }
*/
  changeGenre() {
    this.miscellaneousService.selectedGenre.set(this.meta_form.get('genre')?.value);
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

  addCreator(index: number) {
    // console.log('current index', index, 'length', this.creators.length)
    this.creators.insert(index + 1, this.fbs.creator_FG(null));
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

  addIdentifier(index: number) {
    this.identifiers.insert(index + 1, this.fbs.identifier_FG(null));
  }

  removeIdentifier(index: number) {
    this.identifiers.removeAt(index);
  }

  handleLanguageNotification(event: any) {
    if (event.action === 'add') {
      this.addLanguage(event.index);
    } else if (event.action === 'remove') {
      this.removeLanguage(event.index);
    }
  }

  addLanguage(index: number) {
    this.languages.insert(index + 1, this.fb.control(''));
  }

  removeLanguage(index: number) {
    this.languages.removeAt(index);
  }

  handleSourceNotification(event: any) {
    if (event.action === 'add') {
      this.addSource(event.index);
    } else if (event.action === 'remove') {
      this.removeSource(event.index);
    }
  }

  addSource(index: number) {
    this.sources.insert(index + 1, this.fbs.source_FG(null));
  }

  removeSource(index: number) {
    this.sources.removeAt(index);
  }

  handleSubjectNotification(event: any) {
    if (event.action === 'add') {
      this.addSubject(event.index);
    } else if (event.action === 'remove') {
      this.removeSubject(event.index);
    }
  }

  addSubject(index: number) {
    this.subjects.insert(index + 1, this.fbs.subject_FG(null));
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
  }

  handleAbstractNotification(event: any) {
    if (event.action === 'add') {
      this.addAbstract(event.index);
    } else if (event.action === 'remove') {
      this.removeAbstract(event.index);
    }
  }

  addAbstract(index: number) {
    this.abstracts.insert(index + 1, this.fbs.abstract_FG(null));
  }

  removeAbstract(index: number) {
    this.abstracts.removeAt(index);
  }

  handleProjectInfoNotification(event: any) {
    if (event.action === 'add') {
      this.addProjectInfo(event.index);
    } else if (event.action === 'remove') {
      this.removeProjectInfo(event.index);
    }
  }

  addProjectInfo(index: number) {
    this.projectInfo.insert(index + 1, this.fbs.project_info_FG(null));
  }

  removeProjectInfo(index: number) {
    this.projectInfo.removeAt(index);
  }

  dropCreator(event: CdkDragDrop<string[]>) {
    this.moveItemInArray(this.creators, event.previousIndex, event.currentIndex);
  }

  /** Copied from Angular CDK to make our FormArrays work with drag and drop */
  moveItemInArray<T = any>(array: FormArray<FormGroup<ControlType<T>>>, fromIndex: number, toIndex: number): void {
    let object: any = array.at(fromIndex);
    array.removeAt(fromIndex);
    array.insert(toIndex, object);
  }

}
