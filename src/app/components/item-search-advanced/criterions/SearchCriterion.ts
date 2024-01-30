import {FormBuilder, FormGroup} from "@angular/forms";

export enum SearchType {
  TITLE,
  KEYWORD,
  CLASSIFICATION,

  AND_OP,
  OR_OP,
  NOT_OP,

  OPENING_PARENTHESIS,
  CLOSING_PARENTHESIS

}
export abstract class SearchCriterion {
  //type! : Type;

  protected fb = new FormBuilder();
  level: Number = 0;
  type: SearchType;
  form!: FormGroup;

  constructor(type : SearchType) {
    this.type = type;
  }

  public abstract initForm(): FormGroup;

  public abstract getElasticSearchNestedPath(): string;

  public abstract getQueryStringContent(): string;

  public abstract isEmpty(): boolean;

  public abstract parseQueryStringContent(content: string): void;

  public abstract toElasticSearchQuery(): Object | undefined;

  public abstract getNewInstance(): SearchCriterion;

  public abstract getDisplayType() : string;


  protected escapeForQueryString(escapeMe: string) : string {
  let result = escapeMe.replace("\\", "\\\\");
  result = result.replace("=", "\\=");
  result = result.replace("|", "\\|");
  result = result.replace("(", "\\(");
  result = result.replace(")", "\\)");
  result = result.replace("\"", "\\\"");
  return result;
}

protected unescapeForQueryString(escapeMe: string): string {
  let result = escapeMe.replace("\\=", "=");
  result = result.replace("\\\"", "\"");
  result = result.replace("\\|", "|");
  result = result.replace("\\(", "(");
  result = result.replace("\\)", ")");
  result = result.replace("\\\\", "\\");
  return result;
}


  public baseElasticSearchQueryBuilder(elasticIndexes: string[], searchString: string): Object | undefined {
    return undefined;
  }




}
