import {SearchCriterion} from "./SearchCriterion";
import {FormControl, Validators} from "@angular/forms";
import {baseElasticSearchQueryBuilder, buildDateRangeQuery} from "../../../shared/services/search-utils";
import {IngeCrudService} from "../../../services/inge-crud.service";
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";


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
    const from: string = this.content.get('text')?.value;
    const to: string = this.content.get('hidden')?.value;

    return ((!from) || from.trim()==="") && ((!to) || to.trim()==="");
  }


  override toElasticSearchQuery(): Object | undefined {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;
    if (hidden && hidden.trim()!=="") {
      return baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden);
    } else {
      return baseElasticSearchQueryBuilder(this.getElasticSearchFieldForSearchString(), text);
    }
  }



  protected abstract getElasticSearchFieldForHiddenId(): string[];

  protected abstract  getElasticSearchFieldForSearchString(): string[];
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


  override toElasticSearchQuery(): Object | undefined {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;
    const role: string = this.content.get('role')?.value;

    const multiMatchForSearchString = {
      multi_match : {
        query: text,
        fields: this.getElasticSearchFieldForSearchString(),
        operator: "and",
        type: "cross_fields"

      }
    };

    if (!role) {
      if (hidden && hidden.trim()) {
        return baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden);
      } else {
        return multiMatchForSearchString;
        //return MultiMatchQuery.of(m -> m.query(this.getSearchString()).fields(Arrays.asList(this.getElasticSearchFieldForSearchString()))
          //.type(TextQueryType.CrossFields).operator(Operator.And))._toQuery();
      }

    } else {

      return {
        nested: {
          path:"metadata.creators",
          query: {
            bool: {
              must: [
                baseElasticSearchQueryBuilder("metadata.creators.role", role),
                (hidden && hidden.trim()) ? [baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hidden)] : multiMatchForSearchString,

              ]
            }
          }
        }
      }
    }
  }

}




export class OrganizationSearchCriterion extends StringOrHiddenIdSearchCriterion {

  includeSource : boolean = false;
  //includeSuccessorsAndPredecessors = false;

  //httpClient = inject(HttpClient);


  constructor() {
    super("organization");
    this.content.addControl("includePredecessorsAndSuccessors", new FormControl());
  }

  protected getElasticSearchFieldForHiddenId(): string[] {
    return ["metadata.creators.person.organizations.identifier", "metadata.creators.organization.identifier", ...(this.includeSource) ? "metadata.sources.creators.person.organizations.identifierPath" : []];
  }

  protected getElasticSearchFieldForSearchString(): string[] {
    return ["metadata.creators.person.organizations.name", "metadata.creators.organization.name", ];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.creators";
  }


  override toElasticSearchQuery(): Object | undefined {
    const text: string = this.content.get('text')?.value;
    const hidden: string = this.content.get('hidden')?.value;
    const role: string = this.content.get('role')?.value;

    const hiddenIds = [hidden];

    if (this.content.get("includePredecessorsAndSuccessors")?.value && hidden && hidden.trim())
    {
      //TODO Add logic

      //hiddenIds.push((ou['predecessorAffiliations'] as Array<Object>).map(pa => pa['id']));
    }


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
        return baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hiddenIds);
      } else {
        return multiMatchForSearchString;
        //return MultiMatchQuery.of(m -> m.query(this.getSearchString()).fields(Arrays.asList(this.getElasticSearchFieldForSearchString()))
        //.type(TextQueryType.CrossFields).operator(Operator.And))._toQuery();
      }

    } else {

      return {
        nested: {
          path: "metadata.creators",
          query: {
            bool: {
              must: [
                baseElasticSearchQueryBuilder("metadata.creators.role", role),
                (hidden && hidden.trim()) ? [baseElasticSearchQueryBuilder(this.getElasticSearchFieldForHiddenId(), hiddenIds)] : multiMatchForSearchString,

              ]
            }
          }
        }
      }
    }
  }
}
