import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AbstractVO,
  AlternativeTitleVO,
  ChecksumAlgorithm,
  ContextDbRO,
  CreatorType,
  CreatorVO,
  EventVO,
  FileDbVO,
  FormatVO,
  FundingInfoVO,
  FundingOrganizationVO,
  FundingProgramVO,
  IdentifierVO,
  InvitationStatus,
  ItemVersionState,
  ItemVersionVO,
  LegalCaseVO,
  MdsFileVO,
  MdsPublicationGenre,
  MdsPublicationVO,
  OA_STATUS,
  OrganizationVO,
  PersonVO,
  ProjectInfoVO,
  PublishingInfoVO,
  ReviewMethod,
  SourceVO,
  Storage,
  SubjectVO,
  Visibility
} from 'src/app/model/inge';
import { creatorValidator } from 'src/app/directives/validation/creator-validation.directive';
import { CreatorsOrganizationsValidator } from 'src/app/directives/validation/creators-organizations-validation.directive';
import { datesValidator } from 'src/app/directives/validation/dates-validation.directive';
import { EventValidator } from 'src/app/directives/validation/event-validation.directive';
import { IdentifierValidator } from 'src/app/directives/validation/identifier-validation.directive';
import { SourceRequiredValidator } from 'src/app/directives/validation/source-required-validation.directive';
import { SourceValidator } from 'src/app/directives/validation/source-validation.directive';
import { Utf8Validator } from 'src/app/directives/validation/utf8-validation.directive';
import { fileDataValidator } from 'src/app/directives/validation/file-data-validation';
import { fileUrlValidator } from 'src/app/directives/validation/file-url-validation.directive';

type Unbox<T> = T extends Array<infer V> ? V : T;

export type ControlType<T> = {
  [K in keyof T]: T[K] extends Array<any>
  ? FormArray<AbstractControl<Unbox<T[K]>>>
  : T[K] extends Record<string, any>
  ? FormGroup<ControlType<T[K]>>
  : AbstractControl<T[K] | null>;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ORCID_PATTERN = /^http[s]?:\/\/orcid.org\/(\d{4})-(\d{4})-(\d{4})-(\d{3}[0-9X])$/;
const DATE_PATTERN = /^[0-9]{4}-?(?:[01][0-9])?-?(?:[0-3][0-9])?$/;
const FILE_TITLE_AND_NAME_PATTERN = /^[^/]+$/;

@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  constructor(
    private fb: FormBuilder,
  ) { }

  item_FG(item: ItemVersionVO | null) {
    const item_form = this.fb.group<ControlType<ItemVersionVO>>({
      context: item?.context ? this.context_FG(item.context) : this.context_FG(null),
      files: this.fb.array(item?.files ? item.files.map(file => this.file_FG(file) as AbstractControl) : []),
      localTags: this.fb.array(item?.localTags ? item.localTags.map(lt => this.fb.nonNullable.control(lt) as AbstractControl) : []),
      metadata: item?.metadata ? this.metadata_FG(item.metadata) : this.metadata_FG(null),
      message: this.fb.nonNullable.control(item?.message ? item.message : null),
      modificationDate: this.fb.nonNullable.control(item?.modificationDate ? item.modificationDate : null),
      objectId: this.fb.nonNullable.control(item?.objectId ? item.objectId : null),
      publicState: this.fb.nonNullable.control(item?.publicState ? item.publicState : ItemVersionState.PENDING),
      versionNumber: this.fb.nonNullable.control(item?.versionNumber ? item.versionNumber : null),
    });
    return item_form;
  }

  context_FG(ctx: ContextDbRO | null) {
    const ctx_form = this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.nonNullable.control(ctx?.objectId ? ctx.objectId : null, [Validators.required]),
      name: this.fb.nonNullable.control(ctx?.name ? ctx.name : null)
    });
    return ctx_form;
  }

  file_FG(file: FileDbVO | null) {
    const file_form = this.fb.group<ControlType<FileDbVO>>({
      objectId: this.fb.nonNullable.control(file?.objectId ? file.objectId : null),
      name: this.fb.nonNullable.control(file?.name ? file.name : null, { validators: [Validators.pattern(FILE_TITLE_AND_NAME_PATTERN)], updateOn: 'blur' }),
      visibility: this.fb.nonNullable.control(file?.visibility ? file.visibility : Visibility.PUBLIC),
      pid: this.fb.nonNullable.control(file?.pid ? file.pid : null),
      content: this.fb.nonNullable.control(file?.content ? file.content : null),
      storage: this.fb.nonNullable.control(file?.storage ? file.storage : Storage.EXTERNAL_URL),
      checksum: this.fb.nonNullable.control(file?.checksum ? file.checksum : null),
      checksumAlgorithm: this.fb.nonNullable.control(file?.checksumAlgorithm ? file.checksumAlgorithm : ChecksumAlgorithm.MD5),
      mimeType: this.fb.nonNullable.control(file?.mimeType ? file.mimeType : null),
      size: this.fb.nonNullable.control(file?.size ? file.size : null),
      metadata: file?.metadata ? this.mds_file_FG(file.metadata) : this.mds_file_FG(null),
      allowedAudienceIds: this.fb.array(file?.allowedAudienceIds ? file.allowedAudienceIds.map(audiencId => this.fb.nonNullable.control(audiencId) as AbstractControl) : []),
      sortkz: this.fb.nonNullable.control(file?.sortkz ? file.sortkz : null),
    },
      { validators: [fileDataValidator, fileUrlValidator], updateOn: 'blur' });
    return file_form;
  }

  mds_file_FG(fileMetadata: MdsFileVO | null) {
    const mdsFile_form = this.fb.group<ControlType<MdsFileVO>>({
      title: this.fb.nonNullable.control(fileMetadata?.title ? fileMetadata.title : null, [Validators.required, Validators.pattern(FILE_TITLE_AND_NAME_PATTERN)]),
      contentCategory: this.fb.nonNullable.control(fileMetadata?.contentCategory ? fileMetadata.contentCategory : null),
      description: this.fb.nonNullable.control(fileMetadata?.description ? fileMetadata.description : null),
      identifiers: this.fb.array(fileMetadata?.identifiers ? fileMetadata.identifiers.map(id => this.identifier_FG(id) as AbstractControl) : []),
      formats: this.fb.array(fileMetadata?.formats ? fileMetadata.formats.map(format => this.format_FG(format) as AbstractControl) : []),
      size: this.fb.nonNullable.control(fileMetadata?.size ? fileMetadata.size : null),
      embargoUntil: this.fb.nonNullable.control(fileMetadata?.embargoUntil ? fileMetadata.embargoUntil : null),
      copyrightDate: this.fb.nonNullable.control(fileMetadata?.copyrightDate ? fileMetadata.copyrightDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      rights: this.fb.nonNullable.control(fileMetadata?.rights ? fileMetadata.rights : null),
      license: this.fb.nonNullable.control(fileMetadata?.license ? fileMetadata.license : null),
      oaStatus: this.fb.nonNullable.control(fileMetadata?.oaStatus ? fileMetadata.oaStatus : OA_STATUS.NOT_SPECIFIED),
    });
    return mdsFile_form;
  }

  format_FG(format: FormatVO | null) {
    const format_form = this.fb.group<ControlType<FormatVO>>({
      value: this.fb.nonNullable.control(format?.value ? format.value : null),
      type: this.fb.nonNullable.control(format?.type ? format.type : null),
    });
    return format_form;
  }


  alt_title_FG(at: AlternativeTitleVO | null) {
    const atf = this.fb.group<ControlType<AlternativeTitleVO>>({
      type: this.fb.nonNullable.control(at?.type ? at.type : null),
      language: this.fb.nonNullable.control(at?.language ? at.language : null),
      value: this.fb.nonNullable.control(at?.value ? at.value : null, { validators: [Utf8Validator], updateOn: 'blur' }),
    });
    return atf;
  }

  creator_FG(creator: CreatorVO | null) {
    const creator_form = this.fb.group<ControlType<CreatorVO>>({
      organization: creator?.organization ? this.organization_FG(creator.organization) : this.organization_FG(null),
      person: creator?.person ? this.person_FG(creator.person) : this.person_FG(null),
      role: this.fb.nonNullable.control(creator?.role ? creator.role : null),
      type: this.fb.nonNullable.control(creator?.type ? creator.type : CreatorType.PERSON)
    },
      { validators: [creatorValidator], updateOn: 'blur' }
    );
    creator?.organization ? creator_form.get('person')?.disable() : creator_form.get('organization')?.disable();
    return creator_form;
  }

  organization_FG(ou: OrganizationVO | null) {
    const ou_form = this.fb.group<ControlType<OrganizationVO>>({
      name: this.fb.nonNullable.control(ou?.name ? ou.name : null),
      identifier: this.fb.nonNullable.control(ou?.identifier ? ou.identifier : null),
      identifierPath: this.fb.array(ou?.identifierPath ? ou.identifierPath.map(s => this.fb.nonNullable.control(s) as AbstractControl) : []),
      address: this.fb.nonNullable.control(ou?.address ? ou.address : null),
    });
    return ou_form;
  }

  person_FG(person: PersonVO | null) {
    const person_form = this.fb.group<ControlType<PersonVO>>({
      givenName: this.fb.nonNullable.control(person?.givenName ? person.givenName : null),
      familyName: this.fb.nonNullable.control(person?.familyName ? person.familyName : null),
      completeName: this.fb.nonNullable.control(person?.completeName ? person.completeName : null),
      titles: this.fb.array(person?.titles ? person.titles.map(t => this.fb.nonNullable.control(t) as AbstractControl) : []),
      alternativeNames: this.fb.array(person?.alternativeNames ? person.alternativeNames.map(an => this.fb.nonNullable.control(an) as AbstractControl) : []),
      pseudonyms: this.fb.array(person?.pseudonyms ? person.pseudonyms.map(p => this.fb.nonNullable.control(p) as AbstractControl) : []),
      orcid: this.fb.nonNullable.control(person?.orcid ? person.orcid : null, { validators: [Validators.pattern(ORCID_PATTERN)], updateOn: 'blur' }),
      identifier: person?.identifier ? this.identifier_FG(person.identifier) : this.identifier_FG(null),
      organizations: this.fb.array(person?.organizations ? person.organizations.map(ou => this.organization_FG(ou) as AbstractControl) : [])
    });
    return person_form;
  }

  identifier_FG(identifier: IdentifierVO | null) {
    const identifier_form = this.fb.group<ControlType<IdentifierVO>>({
      id: this.fb.nonNullable.control(identifier?.id ? identifier.id : null),
      type: this.fb.nonNullable.control(identifier?.type ? identifier.type : null)
    },
      { validators: [IdentifierValidator], updateOn: 'blur' });
    return identifier_form;
  }

  metadata_FG(metadata: MdsPublicationVO | null) {
    const metadata_form = this.fb.group<ControlType<MdsPublicationVO>>({
      title: this.fb.nonNullable.control(metadata?.title ? metadata.title : null, { validators: [Validators.required, Utf8Validator], updateOn: 'blur' }),
      alternativeTitles: this.fb.array(metadata?.alternativeTitles ? metadata.alternativeTitles.map(at => this.alt_title_FG(at) as AbstractControl) : []),
      creators: this.fb.array(metadata?.creators ? metadata.creators.map(creator => this.creator_FG(creator) as AbstractControl) : []),
      dateAccepted: this.fb.nonNullable.control(metadata?.dateAccepted ? metadata.dateAccepted : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      dateCreated: this.fb.nonNullable.control(metadata?.dateCreated ? metadata.dateCreated : null),
      dateModified: this.fb.nonNullable.control(metadata?.dateModified ? metadata.dateModified : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      datePublishedInPrint: this.fb.nonNullable.control(metadata?.datePublishedInPrint ? metadata.datePublishedInPrint : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      datePublishedOnline: this.fb.nonNullable.control(metadata?.datePublishedOnline ? metadata.datePublishedOnline : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      dateSubmitted: this.fb.nonNullable.control(metadata?.dateSubmitted ? metadata.dateSubmitted : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      degree: this.fb.nonNullable.control(metadata?.degree ? metadata.degree : null),
      event: metadata?.event ? this.event_FG(metadata.event) : this.event_FG(null),
      legalCase: metadata?.legalCase ? this.legal_case_FG(metadata.legalCase) : this.legal_case_FG(null),
      genre: this.fb.nonNullable.control(metadata?.genre ? metadata.genre : MdsPublicationGenre.ARTICLE),
      identifiers: this.fb.array(metadata?.identifiers ? metadata.identifiers.map(id => this.identifier_FG(id) as AbstractControl) : []),
      languages: this.fb.array(metadata?.languages ? metadata.languages.map(l => this.fb.nonNullable.control(l) as AbstractControl) : []),
      location: this.fb.nonNullable.control(metadata?.location ? metadata.location : null),
      publishingInfo: metadata?.publishingInfo ? this.publishing_info_FG(metadata.publishingInfo) : this.publishing_info_FG(null),
      reviewMethod: this.fb.nonNullable.control(metadata?.reviewMethod ? metadata.reviewMethod : ReviewMethod.NO_REVIEW),
      sources: this.fb.array(metadata?.sources ? metadata.sources.map(s => this.source_FG(s) as AbstractControl) : []),
      freeKeywords: this.fb.nonNullable.control(metadata?.freeKeywords ? metadata.freeKeywords : null),
      subjects: this.fb.array(metadata?.subjects ? metadata.subjects.map(s => this.subject_FG(s) as AbstractControl) : []),
      tableOfContents: this.fb.nonNullable.control(metadata?.tableOfContents ? metadata.tableOfContents : null),
      totalNumberOfPages: this.fb.nonNullable.control(metadata?.totalNumberOfPages ? metadata.totalNumberOfPages : null),
      abstracts: this.fb.array(metadata?.abstracts ? metadata.abstracts.map(a => this.abstract_FG(a) as AbstractControl) : []),
      projectInfo: this.fb.array(metadata?.projectInfo ? metadata.projectInfo.map(pi => this.project_info_FG(pi) as AbstractControl) : []),
    },
      { validators: [datesValidator, CreatorsOrganizationsValidator, SourceRequiredValidator], updateOn: 'blur' }
    );
    return metadata_form;
  }

  source_FG(source: SourceVO | null) {
    const source_form = this.fb.group<ControlType<SourceVO>>({
      alternativeTitles: this.fb.array(source?.alternativeTitles ? source.alternativeTitles.map(at => this.alt_title_FG(at) as AbstractControl) : []),
      title: this.fb.nonNullable.control(source?.title ? source.title : null, { validators: [Validators.required], updateOn: 'blur' }),
      creators: this.fb.array(source?.creators ? source.creators.map(c => this.creator_FG(c) as AbstractControl) : []),
      volume: this.fb.nonNullable.control(source?.volume ? source.volume : null),
      issue: this.fb.nonNullable.control(source?.issue ? source.issue : null),
      datePublishedInPrint: this.fb.nonNullable.control(source?.datePublishedInPrint ? source.datePublishedInPrint : new Date(), { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      startPage: this.fb.nonNullable.control(source?.startPage ? source.startPage : null),
      endPage: this.fb.nonNullable.control(source?.endPage ? source.endPage : null),
      sequenceNumber: this.fb.nonNullable.control(source?.sequenceNumber ? source.sequenceNumber : null),
      publishingInfo: source?.publishingInfo ? this.publishing_info_FG(source.publishingInfo) : this.publishing_info_FG(null),
      identifiers: this.fb.array(source?.identifiers ? source.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : []),
      // sources: this.fb.array(source?.sources ? source.sources.map(s => this.source_FG(s) as any) : [this.source_FG(null)]),
      genre: this.fb.nonNullable.control(source?.genre ? source.genre : null),
      totalNumberOfPages: this.fb.nonNullable.control(source?.totalNumberOfPages ? source.totalNumberOfPages : null),
    },
      { validators: [SourceValidator], updateOn: 'blur' });
    return source_form;
  }

  event_FG(event: EventVO | null) {
    const event_form: any = this.fb.group<ControlType<EventVO>>({
      endDate: this.fb.nonNullable.control(event?.endDate ? event.endDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      invitationStatus: this.fb.nonNullable.control(event?.invitationStatus ? event.invitationStatus : InvitationStatus.INVITED),
      place: this.fb.nonNullable.control(event?.place ? event.place : null),
      startDate: this.fb.nonNullable.control(event?.startDate ? event.startDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      title: this.fb.nonNullable.control(event?.title ? event.title : null)
    },
      {
        validators: [EventValidator],
        updateOn: 'blur' // 'blur' or 'change' or 'submit'
      });
    return event_form;
  }

  legal_case_FG(legal_case: LegalCaseVO | null) {
    const case_form = this.fb.group<ControlType<LegalCaseVO>>({
      courtName: this.fb.nonNullable.control(legal_case?.courtName ? legal_case.courtName : null),
      title: this.fb.nonNullable.control(legal_case?.title ? legal_case.title : null),
      identifier: this.fb.nonNullable.control(legal_case?.identifier ? legal_case.identifier : null),
      datePublished: this.fb.nonNullable.control(legal_case?.datePublished ? legal_case.datePublished : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' })
    });
    return case_form;
  }

  publishing_info_FG(info: PublishingInfoVO | null) {
    const info_form = this.fb.group<ControlType<PublishingInfoVO>>({
      edition: this.fb.nonNullable.control(info?.edition ? info.edition : null),
      place: this.fb.nonNullable.control(info?.place ? info.place : null),
      publisher: this.fb.nonNullable.control(info?.publisher ? info.publisher : null)
    });
    return info_form
  }

  subject_FG(subject: SubjectVO | null) {
    const subject_form = this.fb.group<ControlType<SubjectVO>>({
      language: this.fb.nonNullable.control(subject?.language ? subject.language : null),
      value: this.fb.nonNullable.control(subject?.language ? subject.language : null),
      type: this.fb.nonNullable.control(subject?.language ? subject.language : null)
    });
    return subject_form
  }

  abstract_FG(abstract: AbstractVO | null) {
    const abstract_form = this.fb.group<ControlType<AbstractVO>>({
      language: this.fb.nonNullable.control(abstract?.language ? abstract.language : null),
      value: this.fb.nonNullable.control(abstract?.value ? abstract.value : null, { validators: [Utf8Validator], updateOn: 'blur' })
    });
    return abstract_form
  }

  project_info_FG(pi: ProjectInfoVO | null) {
    const pi_form = this.fb.group<ControlType<ProjectInfoVO>>({
      title: this.fb.nonNullable.control(pi?.title ? pi.title : null),
      fundingInfo: pi?.fundingInfo ? this.funding_info_FG(pi.fundingInfo) : this.funding_info_FG(null),
      grantIdentifier: pi?.grantIdentifier ? this.identifier_FG(pi.grantIdentifier) : this.identifier_FG(null)
    });
    return pi_form
  }

  funding_info_FG(fi: FundingInfoVO | null) {
    const fi_form = this.fb.group<ControlType<FundingInfoVO>>({
      fundingOrganization: fi?.fundingOrganization ? this.funding_org_FG(fi.fundingOrganization) : this.funding_org_FG(null),
      fundingProgram: fi?.fundingProgram ? this.funding_prog_FG(fi.fundingProgram) : this.funding_prog_FG(null)
    });
    return fi_form;
  }

  funding_org_FG(fo: FundingOrganizationVO | null) {
    const fo_form = this.fb.group<ControlType<FundingOrganizationVO>>({
      title: this.fb.nonNullable.control(fo?.title ? fo.title : null),
      identifiers: this.fb.array(fo?.identifiers ? fo.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : [])
    });
    return fo_form
  }

  funding_prog_FG(fp: FundingProgramVO | null) {
    const fp_form = this.fb.group<ControlType<FundingProgramVO>>({
      title: this.fb.nonNullable.control(fp?.title ? fp.title : null),
      identifiers: this.fb.array(fp?.identifiers ? fp.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : [])
    });
    return fp_form
  }
}
