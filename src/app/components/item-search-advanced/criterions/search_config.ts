import {TitleSearchCriterion} from "./standard/TitleSearchCriterion";
import {Parenthesis} from "./operators/Parenthesis";
import {LogicalOperator} from "./operators/LogicalOperator";
import {KeywordSearchCriterion} from "./standard/KeywordSearchCriterion";


function escapeForQueryString(escapeMe: string) : string {
  let result = escapeMe.replace("\\", "\\\\");
  result = result.replace("=", "\\=");
  result = result.replace("|", "\\|");
  result = result.replace("(", "\\(");
  result = result.replace(")", "\\)");
  result = result.replace("\"", "\\\"");
  return result;
}

function unescapeForQueryString(escapeMe: string): string {
  let result = escapeMe.replace("\\=", "=");
  result = result.replace("\\\"", "\"");
  result = result.replace("\\|", "|");
  result = result.replace("\\(", "(");
  result = result.replace("\\)", ")");
  result = result.replace("\\\\", "\\");
  return result;
}

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
  operator: {
    displayType: DisplayType.OPERATOR,
    handlerClass: LogicalOperator
  },
  parenthesis: {
    displayType: DisplayType.PARENTHESIS,
    handlerClass: Parenthesis
  }



}
