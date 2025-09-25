import { StandardSearchCriterion } from "./StandardSearchCriterion";
import { ItemVersionState, MdsPublicationGenre, ReviewMethod } from "../../../model/inge";

export abstract class EnumSearchCriterion extends StandardSearchCriterion {

  keys : string[] = []
  protected constructor(type: string, keys:string[], opts?:any) {
    super(type, opts);
    this.keys=keys;
    this.content.get("text")?.setValue(keys[0]);
  }

  protected getValues() : string[] {
    return this.keys;
  }

 }

export class GenreSearchCriterion extends EnumSearchCriterion {


  constructor(opts?:any) {
    super("genre", Object.keys(MdsPublicationGenre), opts);
  }

  override getElasticIndexes(): string[] {
    return ["metadata.genre"];
  }

}

export class ReviewMethodSearchCriterion extends EnumSearchCriterion {


  constructor(opts?:any) {
    super("reviewMethod", Object.keys(ReviewMethod), opts);
  }

  override getElasticIndexes(): string[] {
    return ["metadata.reviewMethod"];
  }
}

export class StateSearchCriterion extends EnumSearchCriterion {

  constructor(opts?:any) {
    super("state", Object.keys(ItemVersionState), opts);
  }

  override getElasticIndexes(): string[] {
    return ["publicState"];
  }
}
