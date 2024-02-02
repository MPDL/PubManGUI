import {SearchCriterion} from "../SearchCriterion";
import {FormControl, FormGroup} from "@angular/forms";
import {DisplayType} from "../search_config";

export class LogicalOperator extends SearchCriterion {


  constructor(type: string) {
    super(type);
    this.content.addControl(
      "operator" , new FormControl(type)
    );
  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

  isEmpty(): boolean {
    return false;
  }

  toElasticSearchQuery(): Object | undefined {
    return undefined;
  }



}
