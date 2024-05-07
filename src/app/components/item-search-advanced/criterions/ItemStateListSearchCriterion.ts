import {SearchCriterion} from "./SearchCriterion";
import {Observable, of} from "rxjs";
import {StandardSearchCriterion} from "./StandardSearchCriterion";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {DegreeType, ItemVersionState, MdsPublicationGenre} from "../../../model/inge";
import {baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";

export class ItemStateListSearchCriterion extends SearchCriterion {


  itemStateOptions = Object.keys(ItemVersionState);


  constructor() {
    super("itemStateList");
    this.content.addControl("publicationStates", new FormGroup({}));
    this.itemStateOptions.forEach(itemState => this.publicationStatesFormGroup.addControl(itemState, new FormControl(false)));

  }

  override isEmpty(): boolean {
    const isEmpty = !Object.keys(this.publicationStatesFormGroup.controls).some(pubState => this.publicationStatesFormGroup.get(pubState)?.value);
    return isEmpty;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    let shouldClauses: Object[] = [];

    Object.keys(this.publicationStatesFormGroup.controls)
      .filter(genre => this.publicationStatesFormGroup.get(genre)?.value)
      .forEach(pubState => {
      switch (pubState) {
        case "RELEASED" : {
          shouldClauses.push({
            bool: {
              must: [baseElasticSearchQueryBuilder("versionState", pubState)],
              must_not:[baseElasticSearchQueryBuilder("publicState", "WITHDRAWN")],
            }
          });

          break;
        }
        case "SUBMITTED" :
        case "PENDING" :
        case "IN_REVISION" : {
          shouldClauses.push({
            bool: {
              must: [baseElasticSearchQueryBuilder("versionState", pubState)],
              must_not:[baseElasticSearchQueryBuilder("publicState", "WITHDRAWN")],
              //TODO filter out duplicates
            }
          });
          break;
        }
        case "WITHDRAWN" : {
          shouldClauses.push({
            bool: {
              must:[baseElasticSearchQueryBuilder("publicState", pubState)],
            }
          });
          break;
        }
      }
    });

    return of({
      bool: {
        should: shouldClauses
      }
    })


  }


  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

  get publicationStatesFormGroup() {
    return this.content.get("publicationStates") as FormGroup;
  }


}
