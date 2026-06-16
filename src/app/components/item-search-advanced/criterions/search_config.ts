import { Parenthesis } from "./operators/Parenthesis";
import { LogicalOperator } from "./operators/LogicalOperator";
import {
  AnyFieldSearchCriterion,
  ClassificationSearchCriterion,
  CollectionSearchCriterion,
  EventTitleSearchCriterion,
  FulltextSearchCriterion,
  IdentifierSearchCriterion,
  JournalSearchCriterion,
  KeywordSearchCriterion,
  LanguageSearchCriterion,
  LocalTagSearchCriterion,
  OrcidSearchCriterion,
  ProjectInfoSearchCriterion,
  SourceSearchCriterion,
  TitleSearchCriterion
} from "./StandardSearchCriterion";
import { DATE_SEARCH_TYPES, DateSearchCriterion } from "./DateSearchCriterion";
import {
  CreatedBySearchCriterion,
  ModifiedBySearchCriterion,
  OrganizationSearchCriterion,
  PersonSearchCriterion
} from "./StringOrHiddenIdSearchCriterion";
import { GenreSearchCriterion, ReviewMethodSearchCriterion, StateSearchCriterion } from "./EnumSearchCriterion";


export enum DisplayType {
  STANDARD,
  IDENTIFIER,
  PERSON,
  ORGANIZATION,
  CLASSIFICATION,
  CONTEXT,
  DATE,
  LANGUAGE,
  JOURNAL,
  ENUM,
  EXTERNAL_BLOCKS,
  OPERATOR,
  PARENTHESIS
}

export interface searchTypesI {
  [key: string]: searchTypeI;
}

export interface searchTypeI {
  displayType: DisplayType;
  handlerClass: any;
  factory: (type: string, opts: any) => any;
}


/**
 * Directory for flexible search criterions of the advanced search
 */
export const searchTypes : searchTypesI = {
  title: {
    displayType: DisplayType.STANDARD,
    handlerClass: TitleSearchCriterion,
    factory: (type, opts) => new TitleSearchCriterion(opts)
  },
  keyword: {
    displayType: DisplayType.STANDARD,
    handlerClass: KeywordSearchCriterion,
    factory: (type, opts) => new KeywordSearchCriterion(opts)
  },
  person: {
    displayType: DisplayType.PERSON,
    handlerClass: PersonSearchCriterion,
    factory: (type, opts) => new PersonSearchCriterion(opts)
  },
  organization: {
    displayType: DisplayType.ORGANIZATION,
    handlerClass: OrganizationSearchCriterion,
    factory: (type, opts) => new OrganizationSearchCriterion(opts)
  },
  classification: {
    displayType: DisplayType.CLASSIFICATION,
    handlerClass: ClassificationSearchCriterion,
    factory: (type, opts) => new ClassificationSearchCriterion(opts)
  },
  anyField: {
    displayType: DisplayType.STANDARD,
    handlerClass: AnyFieldSearchCriterion,
    factory: (type, opts) => new AnyFieldSearchCriterion(opts)
  },
  fulltext: {
    displayType: DisplayType.STANDARD,
    handlerClass: FulltextSearchCriterion,
    factory: (type, opts) => new FulltextSearchCriterion(type, opts)
  },
  orcid: {
    displayType: DisplayType.STANDARD,
    handlerClass: OrcidSearchCriterion,
    factory: (type, opts) => new OrcidSearchCriterion(opts)
  },
  language: {
    displayType: DisplayType.LANGUAGE,
    handlerClass: LanguageSearchCriterion,
    factory: (type, opts) => new LanguageSearchCriterion(opts)
  },
  eventTitle: {
    displayType: DisplayType.STANDARD,
    handlerClass: EventTitleSearchCriterion,
    factory: (type, opts) => new EventTitleSearchCriterion(opts)
  },
  source: {
    displayType: DisplayType.STANDARD,
    handlerClass: SourceSearchCriterion,
    factory: (type, opts) => new SourceSearchCriterion(opts)
  },
  journal: {
    displayType: DisplayType.JOURNAL,
    handlerClass: JournalSearchCriterion,
    factory: (type, opts) => new JournalSearchCriterion(opts)
  },
  localTag: {
    displayType: DisplayType.STANDARD,
    handlerClass: LocalTagSearchCriterion,
    factory: (type, opts) => new LocalTagSearchCriterion(opts)
  },
  identifier: {
    displayType: DisplayType.IDENTIFIER,
    handlerClass: IdentifierSearchCriterion,
    factory: (type, opts) => new IdentifierSearchCriterion(opts)
  },
  collection: {
    displayType: DisplayType.CONTEXT,
    handlerClass: CollectionSearchCriterion,
    factory: (type, opts) => new CollectionSearchCriterion(opts)
  },
  projectInfo: {
    displayType: DisplayType.STANDARD,
    handlerClass: ProjectInfoSearchCriterion,
    factory: (type, opts) => new ProjectInfoSearchCriterion(opts)
  },
  [DATE_SEARCH_TYPES.ANYDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.PUBLISHED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.PUBLISHEDPRINT]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.ACCEPTED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.SUBMITTED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.MODIFIED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.CREATED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.EVENT_STARTDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.EVENT_ENDDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.CREATED_INTERNAL]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.MODIFIED_INTERNAL]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  [DATE_SEARCH_TYPES.COMPONENT_EMBARGO_DATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion,
    factory: (type, opts) => new DateSearchCriterion(type, opts)
  },
  modifiedBy: {
    displayType: DisplayType.STANDARD,
    handlerClass: ModifiedBySearchCriterion,
    factory: (type, opts) => new ModifiedBySearchCriterion(opts)
  },
  createdBy: {
    displayType: DisplayType.STANDARD,
    handlerClass: CreatedBySearchCriterion,
    factory: (type, opts) => new CreatedBySearchCriterion(opts)
  },
  reviewMethod: {
    displayType: DisplayType.ENUM,
    handlerClass: ReviewMethodSearchCriterion,
    factory: (type, opts) => new ReviewMethodSearchCriterion(opts)
  },
  genre: {
    displayType: DisplayType.ENUM,
    handlerClass: GenreSearchCriterion,
    factory: (type, opts) => new GenreSearchCriterion(opts)
  },
  state: {
    displayType: DisplayType.ENUM,
    handlerClass: StateSearchCriterion,
    factory: (type, opts) => new StateSearchCriterion(opts)
  },
  and: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator,
    factory: (type, opts) => new LogicalOperator(type, opts)
  },
  or: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator,
    factory: (type, opts) => new LogicalOperator(type, opts)
  },
  not: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator,
    factory: (type, opts) => new LogicalOperator(type, opts)
  },
  opening_parenthesis: {
    displayType: DisplayType.PARENTHESIS,
    handlerClass: Parenthesis,
    factory: (type, opts) => new Parenthesis(type, opts)
  },
  closing_parenthesis: {
    displayType: DisplayType.PARENTHESIS,
    handlerClass: Parenthesis,
    factory: (type, opts) => new Parenthesis(type, opts)
  }



}
