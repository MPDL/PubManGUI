import {SearchCriterion} from "./SearchCriterion";
import {defaultIfEmpty, forkJoin, map, Observable, of, tap} from "rxjs";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {ContentCategories, DegreeType, MdsPublicationGenre, OA_STATUS, Visibility} from "../../../model/inge";
import {baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";
import {DateSearchCriterion, DATE_SEARCH_TYPES} from "./DateSearchCriterion";


export enum COMPONENT_SEARCH_TYPES {
  FILES = "INTERNAL_MANAGED",
  LOCATORS = "EXTERNAL_URL",
}

export class FileSectionSearchCriterion extends SearchCriterion {

  availabilityOptions = ['YES', 'NO', 'WHATEVER']
  //componentAvailableSearchCriterion = new ComponentAvailabiltySearchCriterion();
  //componentAvailabilitySearchCrierion =
  componentContentCategorySearchCriterion = new ComponentContentCategorySearchCriterion();
  componentVisibilitySearchCriterion = new ComponentVisibilitySearchCriterion();
  embargoDateSearchCriterion = new DateSearchCriterion(DATE_SEARCH_TYPES.COMPONENT_EMBARGO_DATE);
  oaStatusSearchCriterion = new ComponentOaStatusSearchCriterion();

  constructor(fileType: COMPONENT_SEARCH_TYPES) {
    super(fileType);
    this.content.addControl("component_available", new FormControl("WHATEVER"));
    this.content.addControl("fields", new FormArray([
      this.componentVisibilitySearchCriterion,
      this.embargoDateSearchCriterion,
      this.componentContentCategorySearchCriterion,
      this.oaStatusSearchCriterion
    ]));
    this.componentContentCategorySearchCriterion.content.disable();
    this.componentVisibilitySearchCriterion.content.disable();
    this.embargoDateSearchCriterion.content.disable();
    this.oaStatusSearchCriterion.content.disable();

    this.content.get("component_available")?.valueChanges.subscribe(v => {
      if (v === 'YES') {
        this.componentContentCategorySearchCriterion.content.enable();
        this.componentVisibilitySearchCriterion.content.enable();
        this.embargoDateSearchCriterion.content.enable();
        this.oaStatusSearchCriterion.content.enable();
      } else {
        this.componentContentCategorySearchCriterion.content.disable();
        this.componentVisibilitySearchCriterion.content.disable();
        this.embargoDateSearchCriterion.content.disable();
        this.oaStatusSearchCriterion.content.disable();
      }
    })

  }

  override isEmpty(): boolean {
    return this.content.get("component_available")?.value === 'WHATEVER';
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const subQueryObservables = [
      ...!this.componentVisibilitySearchCriterion.isEmpty() ? [this.componentVisibilitySearchCriterion.toElasticSearchQuery()] : [],
      ...!this.embargoDateSearchCriterion.isEmpty() ? [this.embargoDateSearchCriterion.toElasticSearchQuery()] : [],
      ...!this.componentContentCategorySearchCriterion.isEmpty() ? [this.componentContentCategorySearchCriterion.toElasticSearchQuery()] : [],
      ...!this.oaStatusSearchCriterion.isEmpty() ? [this.oaStatusSearchCriterion.toElasticSearchQuery()] : []
    ];
    return forkJoin(subQueryObservables)
      .pipe(
        //required if subQueries are empty
        defaultIfEmpty([]),
        map(queries => {

            let boolQuery: { [k: string]: any } = {};
            switch (this.content.get("component_available")?.value) {
              case "YES" : {
                boolQuery['must'] = [baseElasticSearchQueryBuilder("files.storage", this.type), ...queries];
                break;
              }
              case "NO" : {
                boolQuery['must_not'] = [baseElasticSearchQueryBuilder("files.storage", this.type)];
                break;
              }
              case "WHATEVER" : {
                return of(undefined);
              }
            }

            const query =
              {
                nested: {
                  path: "files",
                  query: {
                    bool: boolQuery
                  }
                }
              }
            console.log("Returning query" + JSON.stringify(query));
            return query;

          }
        ))
  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

}


export abstract class ComponentAvailabiltySearchCriterion extends SearchCriterion {

  availabilityOptions = ['YES', 'NO', 'WHATEVER']

  constructor(type: string) {
    super(type);

    this.content.addControl("available", new FormControl("WHATEVER"));

  }

  override isEmpty(): boolean {
    return this.content.get("available")?.value === 'WHATEVER';
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    switch (this.content.get("available")?.value) {
      case "YES" : {
        return of(baseElasticSearchQueryBuilder("files.storage", this.getStorageType()));
      }
      case "NO" : {
        return of({
            bool: {
              mustNot: baseElasticSearchQueryBuilder("files.storage", this.getStorageType())
            }
          }
        );
      }
      case "WHATEVER" : {
        return of(undefined);
      }
    }

    return of(undefined);

  }

  getElasticSearchNestedPath(): string | undefined {
    return undefined;
  }

  abstract getStorageType(): string;

}

export class FilesAvailabiltySearchCriterion extends ComponentAvailabiltySearchCriterion {
  constructor() {
    super("filesAvailable");
  }

  getStorageType(): string {
    return "internal-managed";
  }
}

export class LocatorAvailabiltySearchCriterion extends ComponentAvailabiltySearchCriterion {
  constructor() {
    super("locatorsAailable");
  }

  getStorageType(): string {
    return "external-url";
  }

}

export class ComponentContentCategorySearchCriterion extends SearchCriterion {

  contentCategoryOptions = Object.keys(ContentCategories);


  constructor() {
    super("contentCategoryList");
    this.content.addControl("contentCategories", new FormGroup({}));
    this.contentCategoryOptions.forEach(cc => this.contentCategoryFormGroup.addControl(cc, new FormControl(false)));
  }

  override isEmpty(): boolean {
    return !Object.keys(this.contentCategoryFormGroup.controls).some(genre => this.contentCategoryFormGroup.get(genre)?.value);
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const ccs: string[] = Object.keys(this.contentCategoryFormGroup.controls)
      .filter(genre => this.contentCategoryFormGroup.get(genre)?.value);


    return of(baseElasticSearchQueryBuilder("files.metadata.contentCategory.keyword", ccs));
  }

  getElasticSearchNestedPath(): string | undefined {
    return "files";
  }

  get contentCategoryFormGroup() {
    return this.content.get("contentCategories") as FormGroup;
  }


}


export class ComponentVisibilitySearchCriterion extends SearchCriterion {

  visibilityOptions = Object.keys(Visibility)


  constructor() {
    super("componentVisibility");
    this.content.addControl("componentVisibility", new FormGroup({}));
    this.visibilityOptions.forEach(cc => this.componentVisibilityFormGroup.addControl(cc, new FormControl(false)));
  }

  override isEmpty(): boolean {
    return !Object.keys(this.componentVisibilityFormGroup.controls).some(genre => this.componentVisibilityFormGroup.get(genre)?.value);
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const visibilities: string[] = Object.keys(this.componentVisibilityFormGroup.controls)
      .filter(genre => this.componentVisibilityFormGroup.get(genre)?.value);


    return of(baseElasticSearchQueryBuilder("files.visibility", visibilities));
  }

  getElasticSearchNestedPath(): string | undefined {
    return "files";
  }

  get componentVisibilityFormGroup() {
    return this.content.get("componentVisibility") as FormGroup;
  }


}

export class ComponentOaStatusSearchCriterion extends SearchCriterion {

  oaStatusOptions = Object.keys(OA_STATUS);


  constructor() {
    super("oaStatus");
    this.content.addControl("oaStatus", new FormGroup({}));
    this.oaStatusOptions.forEach(cc => this.oaStatusFormGroup.addControl(cc, new FormControl(false)));
  }

  override isEmpty(): boolean {
    return !Object.keys(this.oaStatusFormGroup.controls).some(genre => this.oaStatusFormGroup.get(genre)?.value);
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    const oastates: string[] = Object.keys(this.oaStatusFormGroup.controls)
      .filter(genre => this.oaStatusFormGroup.get(genre)?.value).map(state => state.toLowerCase());

    if (oastates.includes(OA_STATUS.NOT_SPECIFIED.toLowerCase())) {
      return of({
        bool: {
          should: [{
            bool: {
              must_not: {
                exists: {
                  field: "files.metadata.oaStatus"
                }
              }
            }
          },
            baseElasticSearchQueryBuilder("files.metadata.oaStatus.keyword", oastates)
          ]

        }

      })
    } else
      return of(baseElasticSearchQueryBuilder("files.metadata.oaStatus.keyword", oastates));
  }

  getElasticSearchNestedPath(): string | undefined {
    return "files";
  }

  get oaStatusFormGroup() {
    return this.content.get("oaStatus") as FormGroup;
  }


}
