import {FormControl, FormGroup} from "@angular/forms";
import {StandardSearchCriterion} from "./StandardSearchCriterion";

export class KeywordSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super("keyword");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.freeKeywords"];
  }

  override getElasticSearchNestedPath(): string | undefined{
    return "";
  }

}
