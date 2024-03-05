/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-20 15:03:37.

export interface AccountUserDbRO extends Serializable {
    name: string;
    objectId: string;
}

export interface AccountUserDbVO extends BasicDbRO {
    active: boolean;
    email: string;
    loginname: string;
    grantList: GrantVO[];
    affiliation: AffiliationDbRO;
    password: string;
}

export interface AffiliationDbRO extends BasicDbRO {
}

export interface AffiliationDbVO extends AffiliationDbRO {
    metadata: MdsOrganizationalUnitDetailsVO;
    parentAffiliation: AffiliationDbRO;
    predecessorAffiliations: AffiliationDbRO[];
    publicStatus: AffiliationState;
    hasChildren: boolean;
    hasPredecessors: boolean;
}

export interface AuditDbVO extends Serializable {
    id: number;
    modificationDate: Date;
    event: EventType;
    modifier: AccountUserDbRO;
    comment: string;
    pubItem: ItemVersionVO;
}

export interface BasicDbRO extends Serializable {
    objectId: string;
    name: string;
    lastModificationDate?: Date;
    creationDate?: Date;
    creator?: AccountUserDbRO;
    modifier?: AccountUserDbRO;
}

export interface BatchProcessItemVO extends Serializable {
    objectId: number;
    batchProcessMessage: BatchProcessMessages;
    batchProcessMessageType: BatchProcessMessagesTypes;
    itemVersionVO: ItemVersionVO;
}

export interface BatchProcessLogDbVO extends Serializable {
    batchProcessLogItemList: BatchProcessItemVO[];
}

export interface ContextDbRO extends BasicDbRO {
}

export interface ContextDbVO extends ContextDbRO, Searchable, Serializable {
    allowedGenres: MdsPublicationGenre[];
    allowedSubjectClassifications: SubjectClassification[];
    workflow: Workflow;
    contactEmail: string;
    state: ContextState;
    description: string;
    responsibleAffiliations: AffiliationDbRO[];
}

export interface FileDbRO extends BasicDbRO {
}

export interface FileDbVO extends FileDbRO {
    visibility: Visibility;
    pid: string;
    content: string;
    storage: Storage;
    checksum: string;
    checksumAlgorithm: ChecksumAlgorithm;
    mimeType: string;
    size: number;
    metadata: MdsFileVO;
    allowedAudienceIds: string[];
}

export interface ItemRootVO extends Serializable {
    objectId: string;
    lastModificationDate: Date;
    publicState: ItemVersionState;
    objectPid: string;
    creator: AccountUserDbRO;
    context: ContextDbRO;
    creationDate: Date;
    latestRelease: ItemVersionRO;
    latestVersion: ItemVersionRO;
    localTags: string[];
}

export interface ItemVersionRO extends Serializable {
    objectId?: string;
    versionNumber?: number;
    modificationDate?: Date;
    versionState?: ItemVersionState;
    versionPid?: string;
    modifier?: AccountUserDbRO;
}

export interface ItemVersionVO extends ItemVersionRO {
    message: string;
    lastModificationDate?: Date;
    publicState?: ItemVersionState;
    objectPid?: string;
    creator?: AccountUserDbRO;
    context: ContextDbRO;
    creationDate?: Date;
    latestRelease?: ItemVersionRO;
    latestVersion?: ItemVersionRO;
    localTags: string[];
    metadata: MdsPublicationVO;
    files?: FileDbVO[];
}

export interface StagedFileDbVO extends Serializable {
    id: number;
    creationDate: Date;
    path: string;
    creatorId: string;
    filename: string;
}

export interface VersionableId extends Serializable {
    objectId: string;
    versionNumber: number;
}

export interface Serializable {
}

export interface GrantVO extends ValueObject {
    role: string;
    grantType: string;
    objectRef: string;
}

export interface MdsOrganizationalUnitDetailsVO extends MetadataSetVO {
    city: string;
    coordinates: Coordinates;
    countryCode: string;
    descriptions: string[];
    identifiers: IdentifierVO[];
    name: string;
    alternativeNames: string[];
    type: string;
    startDate: string;
    endDate: string;
}

export interface Searchable extends Cloneable {
}

export interface MdsFileVO extends MetadataSetVO {
    contentCategory: string;
    description: string;
    identifiers: IdentifierVO[];
    formats: FormatVO[];
    /**
     * @deprecated
     */
    size: number;
    embargoUntil: string;
    copyrightDate: string;
    rights: string;
    license: string;
    oaStatus: OA_STATUS;
}

export interface MdsPublicationVO extends MetadataSetVO, Cloneable {
    alternativeTitles: AlternativeTitleVO[];
    creators: CreatorVO[];
    dateAccepted: string;
    dateCreated: string;
    dateModified: string;
    datePublishedInPrint: string;
    datePublishedOnline: string;
    dateSubmitted: string;
    degree: DegreeType;
    event: EventVO;
    legalCase: LegalCaseVO;
    genre: MdsPublicationGenre;
    identifiers: IdentifierVO[];
    languages: string[];
    location: string;
    publishingInfo: PublishingInfoVO;
    reviewMethod: ReviewMethod;
    sources: SourceVO[];
    freeKeywords: string;
    subjects: SubjectVO[];
    tableOfContents: string;
    totalNumberOfPages: string;
    abstracts: AbstractVO[];
    projectInfo: ProjectInfoVO[];
}

export interface ValueObject extends Serializable {
}

export interface Coordinates extends Serializable {
    latitude: number;
    longitude: number;
    altitude: number;
}

export interface IdentifierVO extends ValueObject, Cloneable {
    id: string;
    type: IdType;
}

export interface MetadataSetVO extends ValueObject, Cloneable {
    title: string;
}

export interface Cloneable {
}

export interface FormatVO extends ValueObject {
    value: string;
    type: string;
}

export interface AlternativeTitleVO extends ValueObject, Cloneable {
    language: string;
    value: string;
    type: AlternativeTitleType;
}

export interface CreatorVO extends ValueObject, Cloneable {
    organization: OrganizationVO;
    person: PersonVO;
    role: CreatorRole;
    type: CreatorType;
}

export interface EventVO extends ValueObject, Cloneable {
    endDate: string;
    invitationStatus: InvitationStatus;
    place: string;
    startDate: string;
    title: string;
}

export interface LegalCaseVO extends ValueObject, Cloneable {
    title: string;
    courtName: string;
    identifier: string;
    datePublished: string;
}

export interface PublishingInfoVO extends ValueObject, Cloneable {
    edition: string;
    place: string;
    publisher: string;
}

export interface SourceVO extends ValueObject, Cloneable {
    title: string;
    alternativeTitles: AlternativeTitleVO[];
    creators: CreatorVO[];
    volume: string;
    issue: string;
    datePublishedInPrint?: Date;
    startPage: string;
    endPage: string;
    sequenceNumber: string;
    publishingInfo: PublishingInfoVO;
    identifiers: IdentifierVO[];
    sources?: SourceVO[];
    genre: SourceGenre;
    totalNumberOfPages: string;
}

export interface SubjectVO extends ValueObject, Cloneable {
    language: string;
    value: string;
    type: string;
}

export interface AbstractVO extends ValueObject, Cloneable {
    language: string;
    value: string;
}

export interface ProjectInfoVO extends ValueObject, Cloneable {
    title: string;
    grantIdentifier: IdentifierVO;
    fundingInfo: FundingInfoVO;
}

export interface OrganizationVO extends ValueObject, Cloneable {
    address?: string;
    identifier: string;
    name: string;
    identifierPath?: string[];
}

export interface PersonVO extends ValueObject, Cloneable {
    completeName: string;
    givenName: string;
    familyName: string;
    alternativeNames: string[];
    titles: string[];
    pseudonyms: string[];
    organizations: OrganizationVO[];
    identifier: IdentifierVO;
    orcid: string;
}

export interface FundingInfoVO extends ValueObject, Cloneable {
    fundingOrganization: FundingOrganizationVO;
    fundingProgram: FundingProgramVO;
}

export interface FundingOrganizationVO extends ValueObject, Cloneable {
    title: string;
    identifiers: IdentifierVO[];
}

export interface FundingProgramVO extends ValueObject, Cloneable {
    title: string;
    identifiers: IdentifierVO[];
}

export const enum AffiliationState {
    CLOSED = "CLOSED",
    OPENED = "OPENED",
}

export const enum EventType {
    CREATE = "CREATE",
    SUBMIT = "SUBMIT",
    RELEASE = "RELEASE",
    REVISE = "REVISE",
    WITHDRAW = "WITHDRAW",
    UPDATE = "UPDATE",
}

export const enum BatchProcessMessages {
    SUCCESS = "SUCCESS",
    STATE_WRONG = "STATE_WRONG",
    FILES_METADATA_NOT_CHANGED = "FILES_METADATA_NOT_CHANGED",
    FILES_METADATA_OLD_VALUE_NOT_EQUAL = "FILES_METADATA_OLD_VALUE_NOT_EQUAL",
    METADATA_CHANGE_VALUE_NOT_ALLOWED = "METADATA_CHANGE_VALUE_NOT_ALLOWED",
    METADATA_NOT_CHANGED = "METADATA_NOT_CHANGED",
    METADATA_NO_CHANGE_VALUE = "METADATA_NO_CHANGE_VALUE",
    METADATA_NO_NEW_VALUE_SET = "METADATA_NO_NEW_VALUE_SET",
    METADATA_NO_SOURCE_FOUND = "METADATA_NO_SOURCE_FOUND",
    METADATA_CHANGE_VALUE_NOT_EQUAL = "METADATA_CHANGE_VALUE_NOT_EQUAL",
    METADATA_CHANGE_VALUE_ORCID_NO_PERSON = "METADATA_CHANGE_VALUE_ORCID_NO_PERSON",
    METADATA_LOST = "METADATA_LOST",
    VALIDATION_GLOBAL = "VALIDATION_GLOBAL",
    VALIDATION_NO_SOURCE = "VALIDATION_NO_SOURCE",
    ITEM_NOT_FOUND = "ITEM_NOT_FOUND",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
}

export const enum BatchProcessMessagesTypes {
    INFO = "INFO",
    ERROR = "ERROR",
    SUCCESS = "SUCCESS",
    WARNING = "WARNING",
}

export enum MdsPublicationGenre {
    ARTICLE = "ARTICLE",
    BLOG_POST = "BLOG_POST",
    BOOK = "BOOK",
    BOOK_ITEM = "BOOK_ITEM",
    BOOK_REVIEW = "BOOK_REVIEW",
    CASE_NOTE = "CASE_NOTE",
    CASE_STUDY = "CASE_STUDY",
    COLLECTED_EDITION = "COLLECTED_EDITION",
    COMMENTARY = "COMMENTARY",
    CONFERENCE_PAPER = "CONFERENCE_PAPER",
    CONFERENCE_REPORT = "CONFERENCE_REPORT",
    CONTRIBUTION_TO_COLLECTED_EDITION = "CONTRIBUTION_TO_COLLECTED_EDITION",
    CONTRIBUTION_TO_COMMENTARY = "CONTRIBUTION_TO_COMMENTARY",
    CONTRIBUTION_TO_ENCYCLOPEDIA = "CONTRIBUTION_TO_ENCYCLOPEDIA",
    CONTRIBUTION_TO_FESTSCHRIFT = "CONTRIBUTION_TO_FESTSCHRIFT",
    CONTRIBUTION_TO_HANDBOOK = "CONTRIBUTION_TO_HANDBOOK",
    COURSEWARE_LECTURE = "COURSEWARE_LECTURE",
    DATA_PUBLICATION = "DATA_PUBLICATION",
    EDITORIAL = "EDITORIAL",
    ENCYCLOPEDIA = "ENCYCLOPEDIA",
    FESTSCHRIFT = "FESTSCHRIFT",
    FILM = "FILM",
    HANDBOOK = "HANDBOOK",
    INTERVIEW = "INTERVIEW",
    ISSUE = "ISSUE",
    JOURNAL = "JOURNAL",
    MANUAL = "MANUAL",
    MANUSCRIPT = "MANUSCRIPT",
    MEETING_ABSTRACT = "MEETING_ABSTRACT",
    MONOGRAPH = "MONOGRAPH",
    MULTI_VOLUME = "MULTI_VOLUME",
    NEWSPAPER = "NEWSPAPER",
    NEWSPAPER_ARTICLE = "NEWSPAPER_ARTICLE",
    OPINION = "OPINION",
    OTHER = "OTHER",
    PAPER = "PAPER",
    PATENT = "PATENT",
    POSTER = "POSTER",
    PRE_REGISTRATION_PAPER = "PRE_REGISTRATION_PAPER",
    PREPRINT = "PREPRINT",
    PROCEEDINGS = "PROCEEDINGS",
    REGISTERED_REPORT = "REGISTERED_REPORT",
    REPORT = "REPORT",
    REVIEW_ARTICLE = "REVIEW_ARTICLE",
    SERIES = "SERIES",
    SOFTWARE = "SOFTWARE",
    TALK_AT_EVENT = "TALK_AT_EVENT",
    THESIS = "THESIS",
}

export const enum SubjectClassification {
    DDC = "DDC",
    ISO639_3 = "ISO639_3",
    JEL = "JEL",
    JUS = "JUS",
    MPINP = "MPINP",
    MPIPKS = "MPIPKS",
    MPIRG = "MPIRG",
    MPIS_GROUPS = "MPIS_GROUPS",
    MPIS_PROJECTS = "MPIS_PROJECTS",
    MPIWG_PROJECTS = "MPIWG_PROJECTS",
    MPICC_PROJECTS = "MPICC_PROJECTS",
    PACS = "PACS",
}

export enum Workflow {
    STANDARD = "STANDARD",
    SIMPLE = "SIMPLE",
}

export const enum ContextState {
    CLOSED = "CLOSED",
    OPENED = "OPENED",
}

export const enum Visibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    AUDIENCE = "AUDIENCE",
}

export const enum Storage {
    INTERNAL_MANAGED = "INTERNAL_MANAGED",
    EXTERNAL_URL = "EXTERNAL_URL",
}

export const enum ChecksumAlgorithm {
    MD5 = "MD5",
}

export enum ItemVersionState {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    RELEASED = "RELEASED",
    WITHDRAWN = "WITHDRAWN",
    IN_REVISION = "IN_REVISION",
}

export const enum OA_STATUS {
    NOT_SPECIFIED = "NOT_SPECIFIED",
    GOLD = "GOLD",
    HYBRID = "HYBRID",
    GREEN = "GREEN",
    MISCELLANEOUS = "MISCELLANEOUS",
}

export const enum DegreeType {
    BACHELOR = "BACHELOR",
    DIPLOMA = "DIPLOMA",
    HABILITATION = "HABILITATION",
    MAGISTER = "MAGISTER",
    MASTER = "MASTER",
    PHD = "PHD",
    STAATSEXAMEN = "STAATSEXAMEN",
}

export enum ReviewMethod {
    INTERNAL = "INTERNAL",
    NO_REVIEW = "NO_REVIEW",
    PEER = "PEER",
}

export enum IdType {
    ADS = "ADS",
    ARXIV = "ARXIV",
    BIBTEX_CITEKEY = "BIBTEX_CITEKEY",
    BMC = "BMC",
    CONE = "CONE",
    DOI = "DOI",
    EDOC = "EDOC",
    ESCIDOC = "ESCIDOC",
    GRANT_ID = "GRANT_ID",
    ISBN = "ISBN",
    ISI = "ISI",
    ISSN = "ISSN",
    MDB_ID = "MDB_ID",
    MODELMETHOD = "MODELMETHOD",
    OATYPE = "OATYPE",
    OPEN_AIRE = "OPEN_AIRE",
    ORGANISATIONALK = "ORGANISATIONALK",
    OTHER = "OTHER",
    PATENT_APPLICATION_NR = "PATENT_APPLICATION_NR",
    PATENT_NR = "PATENT_NR",
    PATENT_PUBLICATION_NR = "PATENT_PUBLICATION_NR",
    PII = "PII",
    PMC = "PMC",
    PMID = "PMID",
    PND = "PND",
    PUBLISHER = "PUBLISHER",
    REGIONALK = "REGIONALK",
    REPORT_NR = "REPORT_NR",
    RESEARCHTK = "RESEARCHTK",
    SSRN = "SSRN",
    URI = "URI",
    URN = "URN",
    WORKINGGROUP = "WORKINGGROUP",
    ZDB = "ZDB",
}

export enum CreatorRole {
    ARTIST = "ARTIST",
    AUTHOR = "AUTHOR",
    DEVELOPER = "DEVELOPER",
    EDITOR = "EDITOR",
    PAINTER = "PAINTER",
    ILLUSTRATOR = "ILLUSTRATOR",
    PHOTOGRAPHER = "PHOTOGRAPHER",
    COMMENTATOR = "COMMENTATOR",
    TRANSCRIBER = "TRANSCRIBER",
    ADVISOR = "ADVISOR",
    TRANSLATOR = "TRANSLATOR",
    CONTRIBUTOR = "CONTRIBUTOR",
    HONOREE = "HONOREE",
    REFEREE = "REFEREE",
    INTERVIEWEE = "INTERVIEWEE",
    INTERVIEWER = "INTERVIEWER",
    INVENTOR = "INVENTOR",
    APPLICANT = "APPLICANT",
    DIRECTOR = "DIRECTOR",
    PRODUCER = "PRODUCER",
    ACTOR = "ACTOR",
    CINEMATOGRAPHER = "CINEMATOGRAPHER",
    SOUND_DESIGNER = "SOUND_DESIGNER",
}

export enum CreatorType {
    PERSON = "PERSON",
    ORGANIZATION = "ORGANIZATION",
}

export const enum InvitationStatus {
    INVITED = "INVITED",
}

export const enum SourceGenre {
    BLOG = "BLOG",
    BOOK = "BOOK",
    PROCEEDINGS = "PROCEEDINGS",
    JOURNAL = "JOURNAL",
    ISSUE = "ISSUE",
    RADIO_BROADCAST = "RADIO_BROADCAST",
    SERIES = "SERIES",
    TV_BROADCAST = "TV_BROADCAST",
    WEB_PAGE = "WEB_PAGE",
    NEWSPAPER = "NEWSPAPER",
    ENCYCLOPEDIA = "ENCYCLOPEDIA",
    MULTI_VOLUME = "MULTI_VOLUME",
    COMMENTARY = "COMMENTARY",
    HANDBOOK = "HANDBOOK",
    COLLECTED_EDITION = "COLLECTED_EDITION",
    FESTSCHRIFT = "FESTSCHRIFT",
}

export enum AlternativeTitleType {
    ABBREVIATION = "ABBREVIATION",
    HTML = "HTML",
    LATEX = "LATEX",
    MATHML = "MATHML",
    SUBTITLE = "SUBTITLE",
    OTHER = "OTHER",
}

