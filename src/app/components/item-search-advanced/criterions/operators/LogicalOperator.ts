import {SearchCriterion} from "../SearchCriterion";
import {FormControl, FormGroup} from "@angular/forms";
import {DisplayType} from "../search_config";

export class LogicalOperator extends SearchCriterion {


  constructor() {
    super("operator");
    this.content.addControl(
      "operator" , new FormControl('AND')
    );
  }

  getElasticSearchNestedPath(): string | null {
    return null;
  }

  getNewInstance() {
    return new LogicalOperator();
  }

  isEmpty(): boolean {
    return false;
  }

  toElasticSearchQuery(): Object | null {
    return null;
  }



}
