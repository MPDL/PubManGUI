import { SearchCriterion } from "../SearchCriterion";
import { FormControl } from "@angular/forms";
import { Observable, of } from "rxjs";

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

  toElasticSearchQuery(): Observable<Object | undefined> {
    return of(undefined);
  }



}
