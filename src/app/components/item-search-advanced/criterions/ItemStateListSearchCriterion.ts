import { SearchCriterion } from "./SearchCriterion";
import { Observable, of } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { ItemVersionState } from "../../../model/inge";
import { baseElasticSearchQueryBuilder } from "../../../utils/search-utils";
import { AaService } from "../../../services/aa.service";

export class ItemStateListSearchCriterion extends SearchCriterion {


  itemStateOptions = Object.keys(ItemVersionState);

  aaService = AaService.instance;

  constructor() {
    super("itemStateList");
    this.content.addControl("publicationStates", new FormGroup({}));
    this.itemStateOptions.forEach(itemState => this.publicationStatesFormGroup.addControl(itemState, new FormControl(false)));

    this.aaService.principal.subscribe(p => {
      if(p.loggedIn) {
        this.publicationStatesFormGroup.get(ItemVersionState.PENDING.valueOf())?.setValue(true);
        this.publicationStatesFormGroup.get(ItemVersionState.SUBMITTED.valueOf())?.setValue(true);
        this.publicationStatesFormGroup.get(ItemVersionState.RELEASED.valueOf())?.setValue(true);
        this.publicationStatesFormGroup.get(ItemVersionState.IN_REVISION.valueOf())?.setValue(true);
      }
      else {
        this.itemStateOptions.forEach(itemState => this.publicationStatesFormGroup.get(itemState)?.setValue(false));
      }
    })

  }

  /**
   * Always return false, as we need to filter out withdrawn and duplicates
   */
  override isEmpty(): boolean {
    /*
    const isEmpty = !Object.keys(this.publicationStatesFormGroup.controls).some(pubState => this.publicationStatesFormGroup.get(pubState)?.value);
    return isEmpty;
    */

    return false;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    let shouldClauses: Object[] = [];

    const selectedStates = Object.keys(this.publicationStatesFormGroup.controls)
      .filter(genre => this.publicationStatesFormGroup.get(genre)?.value);


    //if no states are selected, filter withdrawn items and duplicate versions
    if(selectedStates.length === 0) {
      const filterOutQuery = AaService.instance.filterOutQuery([ItemVersionState.PENDING, ItemVersionState.SUBMITTED, ItemVersionState.IN_REVISION]);
      return of(
        {
        bool: {
          must_not: [
            baseElasticSearchQueryBuilder("publicState", "WITHDRAWN"),
            ...(filterOutQuery ? [filterOutQuery] : [])
          ]

          }
        }
      )
    }

      selectedStates.forEach(pubState => {
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
              must_not:[
                baseElasticSearchQueryBuilder("publicState", "WITHDRAWN"),
                AaService.instance.filterOutQuery([pubState])
              ],
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
