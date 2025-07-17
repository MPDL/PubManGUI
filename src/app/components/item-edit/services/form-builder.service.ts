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
import { creatorValidator } from 'src/app/shared/directives/creator-validation.directive';
import { CreatorsOrganizationsValidator } from 'src/app/shared/directives/creators-organizations-validation.directive';
import { datesValidator } from 'src/app/shared/directives/dates-validation.directive';
import { EventValidator } from 'src/app/shared/directives/event-validation.directive';
import { IdentifierValidator } from 'src/app/shared/directives/identifier-validation.directive';
import { SourceRequiredValidator } from 'src/app/shared/directives/source-required-validation.directive';
import { SourceValidator } from 'src/app/shared/directives/source-validation.directive';
import { Utf8Validator } from 'src/app/shared/directives/utf8-validation.directive';

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
const DATE_PATTERN = /^[0-9]{4}-?(?:[01][0-9])?-?(?:[0-3][0-9])?$/

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
      localTags: this.fb.array(item?.localTags ? item.localTags.map(lt => this.fb.control(lt) as AbstractControl) : []),
      metadata: item?.metadata ? this.metadata_FG(item.metadata) : this.metadata_FG(null),
      message: this.fb.control(item?.message ? item.message : null),
      modificationDate: this.fb.control(item?.modificationDate ? item.modificationDate : null),
      objectId: this.fb.control(item?.objectId ? item.objectId : null),
      publicState: this.fb.control(item?.publicState ? item.publicState : ItemVersionState.PENDING),
      versionNumber: this.fb.control(item?.versionNumber ? item.versionNumber : null),
    });
    return item_form;
  }

  context_FG(ctx: ContextDbRO | null) {
    const ctx_form = this.fb.group<ControlType<ContextDbRO>>({
      objectId: this.fb.control(ctx?.objectId ? ctx.objectId : null, [Validators.required]),
      name: this.fb.control(ctx?.name ? ctx.name : null)
    });
    return ctx_form;
  }

  file_FG(file: FileDbVO | null) {
    const file_form = this.fb.group<ControlType<FileDbVO>>({
      objectId: this.fb.control(file?.objectId ? file.objectId : null),
      name: this.fb.control(file?.name ? file.name : null),
      visibility: this.fb.control(file?.visibility ? file.visibility : Visibility.PUBLIC),
      pid: this.fb.control(file?.pid ? file.pid : null),
      content: this.fb.control(file?.content ? file.content : null),
      storage: this.fb.control(file?.storage ? file.storage : Storage.EXTERNAL_URL),
      checksum: this.fb.control(file?.checksum ? file.checksum : null),
      checksumAlgorithm: this.fb.control(file?.checksumAlgorithm ? file.checksumAlgorithm : ChecksumAlgorithm.MD5),
      mimeType: this.fb.control(file?.mimeType ? file.mimeType : null),
      size: this.fb.control(file?.size ? file.size : null),
      metadata: file?.metadata ? this.mds_file_FG(file.metadata) : this.mds_file_FG(null),
      allowedAudienceIds: this.fb.array(file?.allowedAudienceIds ? file.allowedAudienceIds.map(audiencId => this.fb.control(audiencId) as AbstractControl) : []),
      sortkz: this.fb.control(file?.sortkz ? file.sortkz : null),
    });
    return file_form;
  }

  mds_file_FG(fileMetadata: MdsFileVO | null) {
    const mdsFile_form = this.fb.group<ControlType<MdsFileVO>>({
      title: this.fb.control(fileMetadata?.title ? fileMetadata.title : null, [Validators.required]),
      contentCategory: this.fb.control(fileMetadata?.contentCategory ? fileMetadata.contentCategory : null),
      description: this.fb.control(fileMetadata?.description ? fileMetadata.description : null),
      identifiers: this.fb.array(fileMetadata?.identifiers ? fileMetadata.identifiers.map(id => this.identifier_FG(id) as AbstractControl) : []),
      formats: this.fb.array(fileMetadata?.formats ? fileMetadata.formats.map(format => this.format_FG(format) as AbstractControl) : []),
      size: this.fb.control(fileMetadata?.size ? fileMetadata.size : null),
      embargoUntil: this.fb.control(fileMetadata?.embargoUntil ? fileMetadata.embargoUntil : null),
      copyrightDate: this.fb.control(fileMetadata?.copyrightDate ? fileMetadata.copyrightDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      rights: this.fb.control(fileMetadata?.rights ? fileMetadata.rights : null),
      license: this.fb.control(fileMetadata?.license ? fileMetadata.license : null),
      oaStatus: this.fb.control(fileMetadata?.oaStatus ? fileMetadata.oaStatus : OA_STATUS.NOT_SPECIFIED),
    });
    return mdsFile_form;
  }

  format_FG(format: FormatVO | null) {
    const format_form = this.fb.group<ControlType<FormatVO>>({
      value: this.fb.control(format?.value ? format.value : null),
      type: this.fb.control(format?.type ? format.type : null),
    });
    return format_form;
  }


  alt_title_FG(at: AlternativeTitleVO | null) {
    const atf = this.fb.group<ControlType<AlternativeTitleVO>>({
      type: this.fb.control(at?.type ? at.type : null),
      language: this.fb.control(at?.language ? at.language : null),
      value: this.fb.control(at?.value ? at.value : null, {validators: [Utf8Validator], updateOn: 'blur'}),
    });
    return atf;
  }

  creator_FG(creator: CreatorVO | null) {
    const creator_form = this.fb.group<ControlType<CreatorVO>>({
      organization: creator?.organization ? this.organization_FG(creator.organization) : this.organization_FG(null),
      person: creator?.person ? this.person_FG(creator.person) : this.person_FG(null),
      role: this.fb.control(creator?.role ? creator.role : null),
      type: this.fb.control(creator?.type ? creator.type : CreatorType.PERSON)
    },
      { validators: [creatorValidator], updateOn: 'blur' }
    );
    creator?.organization ? creator_form.get('person')?.disable() : creator_form.get('organization')?.disable();
    return creator_form;
  }

  organization_FG(ou: OrganizationVO | null) {
    const ou_form = this.fb.group<ControlType<OrganizationVO>>({
      name: this.fb.control(ou?.name ? ou.name : null),
      identifier: this.fb.control(ou?.identifier ? ou.identifier : null),
      identifierPath: this.fb.array(ou?.identifierPath ? ou.identifierPath.map(s => this.fb.control(s) as AbstractControl) : []),
      address: this.fb.control(ou?.address ? ou.address : null),
    });
    return ou_form;
  }

  person_FG(person: PersonVO | null) {
    const person_form = this.fb.group<ControlType<PersonVO>>({
      givenName: this.fb.control(person?.givenName ? person.givenName : null),
      familyName: this.fb.control(person?.familyName ? person.familyName : null),
      completeName: this.fb.control(person?.completeName ? person.completeName : null),
      titles: this.fb.array(person?.titles ? person.titles.map(t => this.fb.control(t) as AbstractControl) : []),
      alternativeNames: this.fb.array(person?.alternativeNames ? person.alternativeNames.map(an => this.fb.control(an) as AbstractControl) : []),
      pseudonyms: this.fb.array(person?.pseudonyms ? person.pseudonyms.map(p => this.fb.control(p) as AbstractControl) : []),
      orcid: this.fb.control(person?.orcid ? person.orcid : null),
      identifier: person?.identifier ? this.identifier_FG(person.identifier) : this.identifier_FG(null),
      organizations: this.fb.array(person?.organizations ? person.organizations.map(ou => this.organization_FG(ou) as AbstractControl) : [])
    });
    return person_form;
  }

  identifier_FG(identifier: IdentifierVO | null) {
    const identifier_form = this.fb.group<ControlType<IdentifierVO>>({
      id: this.fb.control(identifier?.id ? identifier.id : null),
      type: this.fb.control(identifier?.type ? identifier.type : null)
    },
      { validators: [IdentifierValidator], updateOn: 'blur' });
    return identifier_form;
  }

  metadata_FG(metadata: MdsPublicationVO | null) {
    const metadata_form = this.fb.group<ControlType<MdsPublicationVO>>({
      title: this.fb.control(metadata?.title ? metadata.title : null, { validators: [Validators.required, Utf8Validator], updateOn: 'blur'}),
      alternativeTitles: this.fb.array(metadata?.alternativeTitles ? metadata.alternativeTitles.map(at => this.alt_title_FG(at) as AbstractControl) : []),
      creators: this.fb.array(metadata?.creators ? metadata.creators.map(creator => this.creator_FG(creator) as AbstractControl) : []),
      dateAccepted: this.fb.control(metadata?.dateAccepted ? metadata.dateAccepted : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      dateCreated: this.fb.control(metadata?.dateCreated ? metadata.dateCreated : null),
      dateModified: this.fb.control(metadata?.dateModified ? metadata.dateModified : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      datePublishedInPrint: this.fb.control(metadata?.datePublishedInPrint ? metadata.datePublishedInPrint : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      datePublishedOnline: this.fb.control(metadata?.datePublishedOnline ? metadata.datePublishedOnline : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      dateSubmitted: this.fb.control(metadata?.dateSubmitted ? metadata.dateSubmitted : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      degree: this.fb.control(metadata?.degree ? metadata.degree : null),
      event: metadata?.event ? this.event_FG(metadata.event) : this.event_FG(null),
      legalCase: metadata?.legalCase ? this.legal_case_FG(metadata.legalCase) : this.legal_case_FG(null),
      genre: this.fb.control(metadata?.genre ? metadata.genre : MdsPublicationGenre.ARTICLE),
      identifiers: this.fb.array(metadata?.identifiers ? metadata.identifiers.map(id => this.identifier_FG(id) as AbstractControl) : []),
      languages: this.fb.array(metadata?.languages ? metadata.languages.map(l => this.fb.control(l) as AbstractControl) : []),
      location: this.fb.control(metadata?.location ? metadata.location : null),
      publishingInfo: metadata?.publishingInfo ? this.publishing_info_FG(metadata.publishingInfo) : this.publishing_info_FG(null),
      reviewMethod: this.fb.control(metadata?.reviewMethod ? metadata.reviewMethod : ReviewMethod.NO_REVIEW),
      sources: this.fb.array(metadata?.sources ? metadata.sources.map(s => this.source_FG(s) as AbstractControl) : []),
      freeKeywords: this.fb.control(metadata?.freeKeywords ? metadata.freeKeywords : null),
      subjects: this.fb.array(metadata?.subjects ? metadata.subjects.map(s => this.subject_FG(s) as AbstractControl) : []),
      tableOfContents: this.fb.control(metadata?.tableOfContents ? metadata.tableOfContents : null),
      totalNumberOfPages: this.fb.control(metadata?.totalNumberOfPages ? metadata.totalNumberOfPages : null),
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
      title: this.fb.control(source?.title ? source.title : null, {validators : [Validators.required], updateOn : 'blur'}),
      creators: this.fb.array(source?.creators ? source.creators.map(c => this.creator_FG(c) as AbstractControl) : []),
      volume: this.fb.control(source?.volume ? source.volume : null),
      issue: this.fb.control(source?.issue ? source.issue : null),
      datePublishedInPrint: this.fb.control(source?.datePublishedInPrint ? source.datePublishedInPrint : new Date(), { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      startPage: this.fb.control(source?.startPage ? source.startPage : null),
      endPage: this.fb.control(source?.endPage ? source.endPage : null),
      sequenceNumber: this.fb.control(source?.sequenceNumber ? source.sequenceNumber : null),
      publishingInfo: source?.publishingInfo ? this.publishing_info_FG(source.publishingInfo) : this.publishing_info_FG(null),
      identifiers: this.fb.array(source?.identifiers ? source.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : []),
      // sources: this.fb.array(source?.sources ? source.sources.map(s => this.source_FG(s) as any) : [this.source_FG(null)]),
      genre: this.fb.control(source?.genre ? source.genre : null),
      totalNumberOfPages: this.fb.control(source?.totalNumberOfPages ? source.totalNumberOfPages : null),
    },
  {validators : [SourceValidator], updateOn: 'blur'});
    return source_form;
  }

  event_FG(event: EventVO | null) {
    const event_form: any = this.fb.group<ControlType<EventVO>>({
      endDate: this.fb.control(event?.endDate ? event.endDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      invitationStatus: this.fb.control(event?.invitationStatus ? event.invitationStatus : InvitationStatus.INVITED),
      place: this.fb.control(event?.place ? event.place : null),
      startDate: this.fb.control(event?.startDate ? event.startDate : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' }),
      title: this.fb.control(event?.title ? event.title : null)
    },
      {
        validators: [EventValidator],
        updateOn: 'blur' // 'blur' or 'change' or 'submit'
      });
    return event_form;
  }

  legal_case_FG(legal_case: LegalCaseVO | null) {
    const case_form = this.fb.group<ControlType<LegalCaseVO>>({
      courtName: this.fb.control(legal_case?.courtName ? legal_case.courtName : null),
      title: this.fb.control(legal_case?.title ? legal_case.title : null),
      identifier: this.fb.control(legal_case?.identifier ? legal_case.identifier : null),
      datePublished: this.fb.control(legal_case?.datePublished ? legal_case.datePublished : null, { validators: [Validators.pattern(DATE_PATTERN)], updateOn: 'blur' })
    });
    return case_form;
  }

  publishing_info_FG(info: PublishingInfoVO | null) {
    const info_form = this.fb.group<ControlType<PublishingInfoVO>>({
      edition: this.fb.control(info?.edition ? info.edition : null),
      place: this.fb.control(info?.place ? info.place : null),
      publisher: this.fb.control(info?.publisher ? info.publisher : null)
    });
    return info_form
  }

  subject_FG(subject: SubjectVO | null) {
    const subject_form = this.fb.group<ControlType<SubjectVO>>({
      language: this.fb.control(subject?.language ? subject.language : null),
      value: this.fb.control(subject?.language ? subject.language : null),
      type: this.fb.control(subject?.language ? subject.language : null)
    });
    return subject_form
  }

  abstract_FG(abstract: AbstractVO | null) {
    const abstract_form = this.fb.group<ControlType<AbstractVO>>({
      language: this.fb.control(abstract?.language ? abstract.language : null),
      value: this.fb.control(abstract?.value ? abstract.value : null, {validators: [Utf8Validator], updateOn: 'blur'})
    });
    return abstract_form
  }

  project_info_FG(pi: ProjectInfoVO | null) {
    const pi_form = this.fb.group<ControlType<ProjectInfoVO>>({
      title: this.fb.control(pi?.title ? pi.title : null),
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
      title: this.fb.control(fo?.title ? fo.title : null),
      identifiers: this.fb.array(fo?.identifiers ? fo.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : [])
    });
    return fo_form
  }

  funding_prog_FG(fp: FundingProgramVO | null) {
    const fp_form = this.fb.group<ControlType<FundingProgramVO>>({
      title: this.fb.control(fp?.title ? fp.title : null),
      identifiers: this.fb.array(fp?.identifiers ? fp.identifiers.map(i => this.identifier_FG(i) as AbstractControl) : [])
    });
    return fp_form
  }
}
