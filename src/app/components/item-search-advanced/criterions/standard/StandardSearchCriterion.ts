import {SearchCriterion, SearchType} from "../SearchCriterion";
import {FormControl, FormGroup, FormBuilder} from "@angular/forms";

export abstract class StandardSearchCriterion extends SearchCriterion {

  protected constructor(type: SearchType) {
    super(type);


  }

  override initForm() : FormGroup {

    this.form = this.fb.group({
      standard : new FormControl('')
    });
    return this.form;
  }

  override getQueryStringContent() : string {
    return this.escapeForQueryString(this.form.get('standard')?.value);
  }

  override parseQueryStringContent(content: string) {
    this.form.setValue({searchString: this.unescapeForQueryString(content)});
  }

  abstract getElasticIndexes(): string[];

  override isEmpty(): boolean {
    const searchString = this.form.get('standard')?.value;
    return searchString == null || searchString.trim().isEmpty();
  }

  override toElasticSearchQuery(): Object | undefined {
    return this.baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.form.get('searchString')?.value);
  }

  override getDisplayType(): string {
    return "STANDARD";
  }


}
