import {FormControl, FormGroup} from "@angular/forms";
import {StandardSearchCriterion} from "./StandardSearchCriterion";

export class TitleSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super("title");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.title", "metadata.alternativeTitles.value"];
  }

  override getElasticSearchNestedPath(): string {
    return "";
  }




}
