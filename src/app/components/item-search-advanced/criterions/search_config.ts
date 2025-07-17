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
  ENUM,
  EXTERNAL_BLOCKS,
  OPERATOR,
  PARENTHESIS
}

export interface searchTypesI {
  [key: string]: searchTypeI;
}

export interface searchTypeI {
  displayType?: DisplayType;
  handlerClass?: any;
}


/**
 * Directory for flexible search criterions of the advanced search
 */
export const searchTypes : searchTypesI = {
  title: {
    displayType: DisplayType.STANDARD,
    handlerClass: TitleSearchCriterion
  },
  keyword: {
    displayType: DisplayType.STANDARD,
    handlerClass: KeywordSearchCriterion
  },
  person: {
    displayType: DisplayType.PERSON,
    handlerClass: PersonSearchCriterion
  },
  organization: {
    displayType: DisplayType.ORGANIZATION,
    handlerClass: OrganizationSearchCriterion
  },
  classification: {
    displayType: DisplayType.CLASSIFICATION,
    handlerClass: ClassificationSearchCriterion
  },
  anyField: {
    displayType: DisplayType.STANDARD,
    handlerClass: AnyFieldSearchCriterion
  },
  fulltext: {
    displayType: DisplayType.STANDARD,
    handlerClass: FulltextSearchCriterion
  },
  orcid: {
    displayType: DisplayType.STANDARD,
    handlerClass: OrcidSearchCriterion
  },
  language: {
    displayType: DisplayType.STANDARD,
    handlerClass: LanguageSearchCriterion
  },
  eventTitle: {
    displayType: DisplayType.STANDARD,
    handlerClass: EventTitleSearchCriterion
  },
  source: {
    displayType: DisplayType.STANDARD,
    handlerClass: SourceSearchCriterion
  },
  journal: {
    displayType: DisplayType.STANDARD,
    handlerClass: JournalSearchCriterion
  },
  localTag: {
    displayType: DisplayType.STANDARD,
    handlerClass: LocalTagSearchCriterion
  },
  identifier: {
    displayType: DisplayType.IDENTIFIER,
    handlerClass: IdentifierSearchCriterion
  },
  collection: {
    displayType: DisplayType.CONTEXT,
    handlerClass: CollectionSearchCriterion
  },
  projectInfo: {
    displayType: DisplayType.STANDARD,
    handlerClass: ProjectInfoSearchCriterion
  },
  [DATE_SEARCH_TYPES.ANYDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.PUBLISHED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.PUBLISHEDPRINT]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.ACCEPTED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.SUBMITTED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.MODIFIED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.CREATED]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.EVENT_STARTDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.EVENT_ENDDATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.CREATED_INTERNAL]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.MODIFIED_INTERNAL]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  [DATE_SEARCH_TYPES.COMPONENT_EMBARGO_DATE]: {
    displayType: DisplayType.DATE,
    handlerClass: DateSearchCriterion
  },
  modifiedBy: {
    displayType: DisplayType.STANDARD,
    handlerClass: ModifiedBySearchCriterion
  },
  createdBy: {
    displayType: DisplayType.STANDARD,
    handlerClass: CreatedBySearchCriterion
  },
  reviewMethod: {
    displayType: DisplayType.ENUM,
    handlerClass: ReviewMethodSearchCriterion
  },
  genre: {
    displayType: DisplayType.ENUM,
    handlerClass: GenreSearchCriterion
  },
  state: {
    displayType: DisplayType.ENUM,
    handlerClass: StateSearchCriterion
  },
  and: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator
  },
  or: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator
  },
  not: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator
  },
  opening_parenthesis: {
    displayType: DisplayType.PARENTHESIS,
    handlerClass: Parenthesis
  },
  closing_parenthesis: {
    displayType: DisplayType.PARENTHESIS,
    handlerClass: Parenthesis
  }



}
