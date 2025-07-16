import { SearchCriterion } from "../SearchCriterion";
import { FormControl, FormGroup } from "@angular/forms";
import { DisplayType } from "../search_config";
import { Observable, of } from "rxjs";

export enum PARENTHESIS_TYPE {
  OPENING_PARENTHESIS="opening_parenthesis",
  CLOSING_PARENTHESIS="closing_parenthesis",
}

export class Parenthesis extends SearchCriterion{



  partnerParenthesis : Parenthesis | undefined;

  constructor(type: string) {
    super(type);
    this.content.addControl(
      "parenthesis" , new FormControl(type)
    );
  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
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

  toElasticSearchQuery(): Observable<Object | undefined> {
    return of(undefined);
  }


}
