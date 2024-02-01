import {SearchCriterion} from "../SearchCriterion";
import {FormControl, FormGroup} from "@angular/forms";
import {DisplayType} from "../search_config";

export class Parenthesis extends SearchCriterion{


  constructor() {
    super("parenthesis");
    this.content.addControl(
      "parenthesis" , new FormControl('(')
    );
  }



  getElasticSearchNestedPath(): string | null {
    return null;
  }

  getNewInstance() {
    return new Parenthesis();
  }

  getDisplayType(): DisplayType {
    return DisplayType.PARENTHESIS;
  }

  initForm(): FormGroup | null {
    return null;
  }

  isEmpty(): boolean {
    return false;
  }

  toElasticSearchQuery(): Object | null {
    return null;
  }



}
