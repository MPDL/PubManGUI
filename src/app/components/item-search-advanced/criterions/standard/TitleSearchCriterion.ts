import {SearchType} from "../SearchCriterion";
import {FormControl, FormGroup} from "@angular/forms";
import {StandardSearchCriterion} from "./StandardSearchCriterion";

export class TitleSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super(SearchType.TITLE);
  }

  getElasticIndexes(): string[] {
    return ["metadata.title", "metadata.alternativeTitles.value"];
  }

  getElasticSearchNestedPath(): string {
    return "";
  }

  getNewInstance() {
    return new TitleSearchCriterion();
  }



}
