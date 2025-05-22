import {SearchCriterion} from "./SearchCriterion";
import {forkJoin, Observable, of} from "rxjs";
import {StandardSearchCriterion} from "./StandardSearchCriterion";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {DegreeType, MdsPublicationGenre} from "../../../model/inge";
import {baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";
import {TranslateService} from "@ngx-translate/core";

export class GenreListSearchCriterion extends SearchCriterion {

  genreOptions = Object.keys(MdsPublicationGenre);
  genreOptions_ = this.genreOptions.filter(key => key !== 'THESIS');

  degreeOptions = Object.keys(DegreeType);

  constructor(private translateService: TranslateService) {
    super("genreList");

    this.content.addControl("genres", new FormGroup({}));
    this.content.addControl("degrees", new FormGroup({}));
    this.genreOptions.forEach(genre => (this.content.get("genres") as FormGroup).addControl(genre, new FormControl(false)));
    this.degreeOptions.forEach(degree => (this.content.get("degrees") as FormGroup).addControl(degree, new FormControl({
      value: false,
      disabled: true
    })));

    //Disable degree fields when THESIS is not selected
    this.genreFormGroup.get("THESIS")?.valueChanges.subscribe(v => {
      Object.keys(this.degreeFormGroup.controls)
        .forEach(degree => {
          if(v) {
            this.degreeFormGroup.get(degree)?.enable();
          }
          else {
            this.degreeFormGroup.get(degree)?.disable();
            this.degreeFormGroup.get(degree)?.setValue(false);
          }

        })
    });
  }

  override isEmpty(): boolean {
    return !Object.keys(this.genreFormGroup.controls).some(genre => this.genreFormGroup.get(genre)?.value);
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const genres: string[] = Object.keys(this.genreFormGroup.controls)
      .filter(genre => this.genreFormGroup.get(genre)?.value);
    const degrees: string[] = Object.keys(this.degreeFormGroup.controls)
      .filter(degree => this.degreeFormGroup.get(degree)?.value);

    if(degrees.length > 0 && genres.length > 0) {
      return of(
        {
          bool: {
            must: [
              baseElasticSearchQueryBuilder("metadata.genre", genres),
              baseElasticSearchQueryBuilder("metadata.degree", degrees)
            ]
          }
        });
    }
    else if (genres.length > 0) {
      return  of(baseElasticSearchQueryBuilder("metadata.genre", genres));
    }
    else if (degrees.length > 0) {
      return  of(baseElasticSearchQueryBuilder("metadata.degree", degrees));
    }

    return of(undefined);

  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

  get genreFormGroup() {
    return this.content.get("genres") as FormGroup;
  }

  get degreeFormGroup() {
    return this.content.get("degrees") as FormGroup;
  }


  selectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    Object.keys(this.genreFormGroup.controls)
      .forEach(genre => this.genreFormGroup.get(genre)?.setValue(target.checked));
  }
}
