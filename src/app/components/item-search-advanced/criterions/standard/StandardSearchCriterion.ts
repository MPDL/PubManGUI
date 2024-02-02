import {SearchCriterion} from "../SearchCriterion";
import {FormControl, FormGroup} from "@angular/forms";
import {DisplayType} from "../search_config";
import {baseElasticSearchQueryBuilder} from "../../../../shared/services/search-utils";

export abstract class StandardSearchCriterion extends SearchCriterion {

  protected constructor(type: string) {
    super(type);
    this.content.addControl("text", new FormControl(''));
  }

  /*
  override getQueryStringContent() : string {
    return this.escapeForQueryString(this.form.get('text')?.value);
  }

  override parseQueryStringContent(content: string) {
    this.form.setValue({text: this.unescapeForQueryString(content)});
  }

   */

  abstract getElasticIndexes(): string[];

  override isEmpty(): boolean {
    const searchString = this.content.get('text')?.value;
    return searchString == null || searchString.trim().length===0;
  }

  override toElasticSearchQuery(): Object | undefined {
    return baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.content.get('text')?.value);
  }


}
