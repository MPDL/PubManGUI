import { SearchCriterion } from "./SearchCriterion";
import { FormControl } from "@angular/forms";
import { baseElasticSearchQueryBuilder } from "../../../shared/services/search-utils";
import { forkJoin, map, Observable, of } from "rxjs";
import { OrganizationsService } from "../../../services/pubman-rest-client/organizations.service";


export abstract class StringOrHiddenIdSearchCriterion extends SearchCriterion {

  protected constructor(type: string) {
    super(type);
    this.content.addControl("text", new FormControl(''));
    this.content.addControl("hidden", new FormControl(''));
  }


  override getElasticSearchNestedPath(): string | undefined {
    return "";
  }

  override isEmpty(): boolean {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;

    //console.log("isEmtpy " + text + hidden)
    return ((!text) || !text.trim()) && ((!hidden) || !hidden.trim());
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;
    if (hidden && hidden.trim() !== "") {
      return of(baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden));
    } else {
      return of(baseElasticSearchQueryBuilder(this.getElasticSearchFieldForSearchString(), text));
    }
  }


  protected abstract getElasticSearchFieldForHiddenId(): string[];

  protected abstract getElasticSearchFieldForSearchString(): string[];
}

export class PersonSearchCriterion extends StringOrHiddenIdSearchCriterion {

  constructor() {
    super("person");
    this.content.addControl("role", new FormControl(""));
  }

  protected getElasticSearchFieldForHiddenId(): string[] {
    return ["metadata.creators.person.identifier.id"];
  }

  protected getElasticSearchFieldForSearchString(): string[] {
    return ["metadata.creators.person.familyName", "metadata.creators.person.givenName"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.creators";
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;
    const role: string = this.content.get('role')?.value;

    const multiMatchForSearchString = {
      multi_match: {
        query: text,
        fields: this.getElasticSearchFieldForSearchString(),
        operator: "and",
        type: "cross_fields"

      }
    };

    if (!role) {
      if (hidden && hidden.trim()) {
        return of(baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden));
      } else {
        return of(multiMatchForSearchString);
        //return MultiMatchQuery.of(m -> m.query(this.getSearchString()).fields(Arrays.asList(this.getElasticSearchFieldForSearchString()))
        //.type(TextQueryType.CrossFields).operator(Operator.And))._toQuery();
      }

    } else {

      return of({
        nested: {
          path: "metadata.creators",
          query: {
            bool: {
              must: [
                baseElasticSearchQueryBuilder("metadata.creators.role", role),
                (hidden && hidden.trim()) ? baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden) : multiMatchForSearchString,

              ]
            }
          }
        }
      })
    }
  }

}

export class OrganizationSearchCriterion extends StringOrHiddenIdSearchCriterion {

  includeSource: boolean = false;

  constructor() {
    super("organization");
    this.content.addControl("includePredecessorsAndSuccessors", new FormControl(false));
  }

  protected getElasticSearchFieldForHiddenId(): string[] {
    return ["metadata.creators.person.organizations.identifierPath", "metadata.creators.organization.identifierPath",
      ...(this.includeSource) ? ["metadata.sources.creators.person.organizations.identifierPath"] : [],
    ];
  }

  protected getElasticSearchFieldForSearchString(): string[] {
    return ["metadata.creators.person.organizations.name", "metadata.creators.organization.name",];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.creators";
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    const hidden: string = this.content.get('hidden')?.value;

    if (hidden && hidden.trim() && this.content.get("includePredecessorsAndSuccessors")?.value) {
      let idSources: Observable<string | string[]>[] = [of(hidden)];

      idSources.push(
        OrganizationsService.instance.retrieve(hidden)
          .pipe(
            map(ou => ou.predecessorAffiliations?.map(pa => pa.objectId))
          )
      );
      idSources.push(
        OrganizationsService.instance.getSuccessors(hidden)
          .pipe(
            map(sr => sr.records?.map(rec => rec.data.objectId))
          )
      );

      return forkJoin(idSources)
        .pipe(
          map(data => data.flat().filter(val => val)),
          map(ouIds => baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), ouIds))
        )

    } else {
      return super.toElasticSearchQuery();
    }
  }

}


export class CreatedBySearchCriterion extends StringOrHiddenIdSearchCriterion {
  constructor() {
    super("createdBy");
  }

  protected getElasticSearchFieldForHiddenId(): string[] {
    return ["createdByRO.objectId"];
  }

  protected getElasticSearchFieldForSearchString(): string[] {
    return ["createdByRO.title"];
  }

}

export class ModifiedBySearchCriterion extends StringOrHiddenIdSearchCriterion {
  constructor() {
    super("modifiedBy");
  }

  protected getElasticSearchFieldForHiddenId(): string[] {
    return ["version.modifiedByRO.objectId"];
  }

  protected getElasticSearchFieldForSearchString(): string[] {
    return ["version.modifiedByRO.title"];
  }

}
