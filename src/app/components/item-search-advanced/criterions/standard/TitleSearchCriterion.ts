import {FormControl, FormGroup} from "@angular/forms";
import {StandardSearchCriterion} from "./StandardSearchCriterion";

export class TitleSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super("title");
  }

  getElasticIndexes(): string[] {
    return ["metadata.title", "metadata.alternativeTitles.value"];
  }

  getElasticSearchNestedPath(): string {
    return "";
  }




}
