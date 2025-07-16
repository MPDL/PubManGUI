import { SearchCriterion } from "./SearchCriterion";
import { Observable, of } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";

export class PublicationStateSearchCriterion extends SearchCriterion {


  pubStateOptions = ['not-specified', 'submitted', 'accepted', 'published-online', 'published-in-print']


  constructor() {
    super("publicationStateList");
    this.content.addControl("publicationStates", new FormGroup({}));
    this.pubStateOptions.forEach(genre => this.publicationStatesFormGroup.addControl(genre, new FormControl(false)));

  }

  override isEmpty(): boolean {
    const isEmpty = !Object.keys(this.publicationStatesFormGroup.controls).some(pubState => this.publicationStatesFormGroup.get(pubState)?.value);
    return isEmpty;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const checkedPubStates: string[] = Object.keys(this.publicationStatesFormGroup.controls)
      .filter(genre => this.publicationStatesFormGroup.get(genre)?.value);

    let shouldClauses: Object[] = [];

    checkedPubStates.forEach(pubState => {
      let mustNotClauses = [];
      let mustClauses = [];
      switch (pubState) {
        case "not-specified" : {
          mustNotClauses.push({exists: {field: "metadata.datePublishedInPrint"}});
          mustNotClauses.push({exists: {field: "metadata.datePublishedOnline"}});
          mustNotClauses.push({exists: {field: "metadata.dateAccepted"}});
          mustNotClauses.push({exists: {field: "metadata.dateSubmitted"}});
          break;
        }
        case "submitted" : {
          mustNotClauses.push({exists: {field: "metadata.datePublishedInPrint"}});
          mustNotClauses.push({exists: {field: "metadata.datePublishedOnline"}});
          mustNotClauses.push({exists: {field: "metadata.dateAccepted"}});
          mustClauses.push({exists: {field: "metadata.dateSubmitted"}});
          break;
        }
        case "accepted" : {
          mustNotClauses.push({exists: {field: "metadata.datePublishedInPrint"}});
          mustNotClauses.push({exists: {field: "metadata.datePublishedOnline"}});
          mustClauses.push({exists: {field: "metadata.dateAccepted"}});
          break;
        }
        case "published-online" : {
          mustNotClauses.push({exists: {field: "metadata.datePublishedInPrint"}});
          mustClauses.push({exists: {field: "metadata.datePublishedOnline"}});
          break;
        }
        case "published-in-print" : {
          mustClauses.push({exists: {field: "metadata.datePublishedInPrint"}});
          break;
        }
      }

      shouldClauses.push(
        {
          bool: {
            ...mustClauses.length > 0 && {must: mustClauses},
            ...mustNotClauses.length > 0 && {must_not: mustNotClauses},
          }
        }
      );

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
