import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {searchTypes} from "./search_config";

export abstract class SearchCriterion extends FormGroup {
  //type! : Type;

  protected fb = new FormBuilder();
  level: Number = 0;
  type: any;
  content!: FormGroup;
  //formGroup!: FormGroup;
  //properties!: any

  protected constructor(type: string) {
    super({type : new FormControl(type)});
    this.type = type;
    //this.properties = (searchTypes as any)[type];
    this.content = this.fb.group({});
    this.addControl("content", this.content);
  }


  public abstract getElasticSearchNestedPath(): string | null;

  //public abstract getQueryStringContent(): string;

  public abstract isEmpty(): boolean;

  //public abstract parseQueryStringContent(content: string): void;

  public abstract toElasticSearchQuery(): Object | null;

  //public abstract getNewInstance(): SearchCriterion;

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


  public baseElasticSearchQueryBuilder(elasticIndexes: string[], searchString: string): Object | null {
    return null;
  }




}
