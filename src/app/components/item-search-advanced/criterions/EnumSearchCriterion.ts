import {SearchCriterion} from "./SearchCriterion";
import {StandardSearchCriterion} from "./StandardSearchCriterion";
import {FormControl} from "@angular/forms";
import {ItemVersionState, MdsPublicationGenre, ReviewMethod} from "../../../model/inge";

export abstract class EnumSearchCriterion extends StandardSearchCriterion {

  keys : string[] = []
  protected constructor(type: string, keys:string[]) {
    super(type);
    this.keys=keys;
    this.content.get("text")?.setValue(keys[0]);
  }

  protected getValues() : string[] {
    return this.keys;
  }

 }

export class GenreSearchCriterion extends EnumSearchCriterion {


  constructor() {
    super("genre", Object.keys(MdsPublicationGenre));
  }

  override getElasticIndexes(): string[] {
    return ["metadata.genre"];
  }

}

export class ReviewMethodSearchCriterion extends EnumSearchCriterion {


  constructor() {
    super("reviewMethod", Object.keys(ReviewMethod));
  }

  override getElasticIndexes(): string[] {
    return ["metadata.reviewMethod"];
  }
}

export class StateSearchCriterion extends EnumSearchCriterion {

  constructor() {
    super("state", Object.keys(ItemVersionState));
  }

  override getElasticIndexes(): string[] {
    return ["publicState"];
  }
}
