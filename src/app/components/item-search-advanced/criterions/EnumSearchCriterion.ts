import { StandardSearchCriterion } from "./StandardSearchCriterion";
import { ItemVersionState, MdsPublicationGenre, ReviewMethod } from "../../../model/inge";
import {IndexField} from "../../../utils/search-utils";

export abstract class EnumSearchCriterion extends StandardSearchCriterion {

  keys : string[] = []

  translatePrefix?:string;

  protected constructor(type: string, keys:string[], opts?:any, translatePrefix?:string) {
    super(type, opts);
    this.keys=keys;
    this.content.get("text")?.setValue(keys[0]);
    this.translatePrefix=translatePrefix;
  }

  protected getValues() : string[] {
    return this.keys;
  }

 }

export class GenreSearchCriterion extends EnumSearchCriterion {


  constructor(opts?:any) {
    super("genre", Object.keys(MdsPublicationGenre), opts, "MdsPublicationGenre.");
  }

  override getElasticIndexes(): IndexField[] {
    return [{index: "metadata.genre", type: "keyword"}];
  }

}

export class ReviewMethodSearchCriterion extends EnumSearchCriterion {


  constructor(opts?:any) {
    super("reviewMethod", Object.keys(ReviewMethod), opts, "ReviewMethod.");
  }

  override getElasticIndexes(): IndexField[] {
    return [{index: "metadata.reviewMethod", type: "keyword"}];
  }
}

export class StateSearchCriterion extends EnumSearchCriterion {

  constructor(opts?:any) {
    super("state", Object.keys(ItemVersionState), opts);
  }

  override getElasticIndexes(): IndexField[] {
    return [{index: "publicState", type: "keyword"}];
  }
}
