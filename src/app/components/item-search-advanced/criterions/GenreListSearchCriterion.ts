import {SearchCriterion} from "./SearchCriterion";
import {Observable, of} from "rxjs";
import {StandardSearchCriterion} from "./StandardSearchCriterion";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {DegreeType, MdsPublicationGenre} from "../../../model/inge";

export class GenreListSearchCriterion extends SearchCriterion {

  genreOptions = Object.keys(MdsPublicationGenre);

  degreeOptions = Object.keys(DegreeType);

  constructor() {
    super("genreList");

    this.content.addControl("genres", new FormGroup({}));
    this.content.addControl("degrees", new FormGroup({}));
    this.genreOptions.forEach(genre => (this.content.get("genres") as FormGroup).addControl(genre, new FormControl(false)));
    this.degreeOptions.forEach(degree => (this.content.get("degrees") as FormGroup).addControl(degree, new FormControl(false)));
  }

  override isEmpty(): boolean {
    return false;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of(undefined);
  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }



}
