import {TitleSearchCriterion} from "./standard/TitleSearchCriterion";
import {Parenthesis} from "./operators/Parenthesis";
import {LogicalOperator} from "./operators/LogicalOperator";
import {KeywordSearchCriterion} from "./standard/KeywordSearchCriterion";

export enum DisplayType {
  STANDARD,
  DATE,
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

export const searchTypes : searchTypesI = {
  title: {
    displayType: DisplayType.STANDARD,
    handlerClass: TitleSearchCriterion
  },
  keyword: {
    displayType: DisplayType.STANDARD,
    handlerClass: KeywordSearchCriterion
  },
  classification: {},
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
