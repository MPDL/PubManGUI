import { SearchCriterion } from "./SearchCriterion";
import { FormControl } from "@angular/forms";
import {baseElasticSearchQueryBuilder, IndexField} from "../../../utils/search-utils";
import { forkJoin, map, Observable, of } from "rxjs";
import { OrganizationsService } from "../../../services/pubman-rest-client/organizations.service";


export abstract class StringOrHiddenIdSearchCriterion extends SearchCriterion {

  protected constructor(type: string, opts?:any) {
    super(type, opts);
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


  protected abstract getElasticSearchFieldForHiddenId(): IndexField[];

  protected abstract getElasticSearchFieldForSearchString(): IndexField[];
}

export class PersonSearchCriterion extends StringOrHiddenIdSearchCriterion {

  constructor(opts?:any) {
    super("person", opts);
    this.content.addControl("role", new FormControl(""));
  }

  protected getElasticSearchFieldForHiddenId(): IndexField[] {

    return [{index: "metadata.creators.person.identifier.id", type: "keyword"}];
  }

  protected getElasticSearchFieldForSearchString(): IndexField[] {
    return [{index: "metadata.creators.person.familyName", type: "text"}, {index: "metadata.creators.person.givenName", type: "text"}];
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
        fields: this.getElasticSearchFieldForSearchString().map(f => f.index),
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
                baseElasticSearchQueryBuilder({index: "metadata.creators.role", type: "keyword"}, role),
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
  ouService: OrganizationsService;

  constructor(opts?:any) {
    super("organization", opts);
    this.ouService = opts.ouService;
    this.content.addControl("includePredecessorsAndSuccessors", new FormControl(false));
  }

  protected getElasticSearchFieldForHiddenId(): IndexField[] {

    const fields: IndexField[] = [
      {index: "metadata.creators.person.organizations.identifierPath", type: "keyword"},
      {index: "metadata.creators.organization.identifierPath", type: "keyword"},
    ];
    if(this.includeSource)
      fields.push({index: "metadata.sources.creators.person.organizations.identifierPath", type: "keyword"});
    return fields;
  }

  protected getElasticSearchFieldForSearchString(): IndexField[] {
    return [{index: "metadata.creators.person.organizations.name", type: "text"}, {index: "metadata.creators.organization.name", type: "text"}];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.creators";
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    const hidden: string = this.content.get('hidden')?.value;

    if (hidden && hidden.trim() && this.content.get("includePredecessorsAndSuccessors")?.value) {
      let idSources: Observable<string | string[]>[] = [of(hidden)];

      idSources.push(
        this.ouService.retrieve(hidden)
          .pipe(
            map(ou => ou.predecessorAffiliations?.map(pa => pa.objectId!))
          )
      );
      idSources.push(
        this.ouService.getSuccessors(hidden)
          .pipe(
            map(sr => sr.records?.map(rec => rec.data.objectId!))
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
  constructor(opts?:any) {
    super("createdBy", opts);
  }

  protected getElasticSearchFieldForHiddenId(): IndexField[] {
    return [{index: "createdByRO.objectId", type: "keyword"}];
  }

  protected getElasticSearchFieldForSearchString(): IndexField[] {
    return [{index: "createdByRO.title", type: "text"}];
  }

}

export class ModifiedBySearchCriterion extends StringOrHiddenIdSearchCriterion {
  constructor(opts?:any) {
    super("modifiedBy", opts);
  }

  protected getElasticSearchFieldForHiddenId(): IndexField[] {
    return [{index: "modifiedByRO.objectId", type: "keyword"}];
  }

  protected getElasticSearchFieldForSearchString(): IndexField[] {
    return [{index: "modifiedByRO.title", type: "text"}];
  }

}
