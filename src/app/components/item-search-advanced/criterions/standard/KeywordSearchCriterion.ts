import {FormControl, FormGroup} from "@angular/forms";
import {StandardSearchCriterion} from "./StandardSearchCriterion";

export class KeywordSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super("keyword");
  }

  getElasticIndexes(): string[] {
    return ["metadata.keywords", "metadata.alternativeTitles.value"];
  }

  getElasticSearchNestedPath(): string {
    return "";
  }

}
