import {SearchCriterion} from "./SearchCriterion";
import {FormControl} from "@angular/forms";
import {baseElasticSearchQueryBuilder} from "../../../shared/services/search-utils";
import {Observable, of} from "rxjs";


export abstract class StandardSearchCriterion extends SearchCriterion {

  protected constructor(type: string) {
    super(type);
    this.content.addControl("text", new FormControl(''));
  }

  getElasticIndexes(): string[] {
    return [];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "";
  }

  override isEmpty(): boolean {
    const searchString = this.content.get('text')?.value;
    return searchString == null || searchString.trim().length===0;
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of(baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.content.get('text')?.value));
  }

  getFormContent(): string {
    return this.content.get('text')?.value;
  }

}

export class TitleSearchCriterion extends StandardSearchCriterion {
  constructor() {
    super("title");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.title", "metadata.alternativeTitles.value"];
  }

}

export class KeywordSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("keyword");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.freeKeywords"];
  }

}

export class ClassificationSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("classification");
    this.content.addControl("classificationType", new FormControl(''));
  }

  override getElasticIndexes(): string[] {
    return ["metadata.subjects.value"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.subjects";
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of({
      nested: {
        path: this.getElasticSearchNestedPath(),
        query: {
          bool: {
            must: [
              baseElasticSearchQueryBuilder("metadata.subjects.type", this.content.get('classificationType')?.value),
              super.toElasticSearchQuery()
            ]
          }
        }
      }
    })

  }

}

export class IdentifierSearchCriterion extends StandardSearchCriterion {


  constructor() {
    super("identifier");
    this.content.addControl("identifierType", new FormControl(''));
  }

  override getElasticIndexes(): string[] {
    return ["objectId","objectPid","versionPid","metadata.identifiers.id","metadata.sources.identifiers.id"];
  }


  override toElasticSearchQuery(): Observable<Object | undefined> {
    if(!this.content.get("identifierType")?.value) {
      return super.toElasticSearchQuery();
    }
    else
    {

      return of({
        bool: {
          should: [{
            nested: {
              path: "metadata.identifiers",
              query: {
                bool: {
                  must: [
                    baseElasticSearchQueryBuilder("metadata.identifiers.type", this.content.get('identifierType')?.value),
                    baseElasticSearchQueryBuilder("metadata.identifiers.id", this.getFormContent())
                  ]
                }
              }
            }
          },
            {
              nested: {
                path: "metadata.sources.identifiers",
                query: {
                  bool: {
                    must: [
                      baseElasticSearchQueryBuilder("metadata.sources.identifiers.type", this.content.get('identifierType')?.value),
                      baseElasticSearchQueryBuilder("metadata.sources.identifiers.id", this.getFormContent())
                    ]
                  }
                }
              }
            }
          ]
        }
      })
    }

  }

}

export class CollectionSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("collection");
  }

  override getElasticIndexes(): string[] {
    return ["context.objectId"];
  }

}

export class AnyFieldSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("anyField");
  }

  override getElasticIndexes(): string[] {
    return ["_all"];
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of({simple_query_string: {query: this.getFormContent(), default_operator: "and", analyze_wildcard: true}})
    //return baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.content.get('text')?.value);
  }
}

export class FulltextSearchCriterion extends StandardSearchCriterion {

  constructor(type?:string) {
    super(type ? type : "fulltext");
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {

    return of({
      has_child : {
        type : "file",
        query: baseElasticSearchQueryBuilder("fileData.attachment.content", this.getFormContent()),
        score_mode: "avg",
        inner_hits: {
          highlight: {
            fields: {"fileData.attachment.content": {}},
            pre_tags: ["<span class=\"searchHit\">"],
            post_tags: ["</span>"]
          },
          _source: {
            excludes: ["fileData.attachment.content"]
          }
        },
      }
    })


    //return {simple_query_string: {query: this.content.get('text')?.value, default_operator: "and", analyze_wildcard: true}}
    //return baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.content.get('text')?.value);
  }
}

export class AnyFieldAndFulltextSearchCriterion extends FulltextSearchCriterion {

  constructor() {
    super("anyFieldAndFulltext");
  }

  override toElasticSearchQuery(): Observable<Object | undefined> {
    return of({
      bool: {
        should : [
          {simple_query_string: {query: this.getFormContent(), default_operator: "and", analyze_wildcard: true}},
          super.toElasticSearchQuery()

        ]

      }
    })
    //return baseElasticSearchQueryBuilder(this.getElasticIndexes(), this.content.get('text')?.value);
  }
}

export class ComponentContentCategorySearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("componentContentCategory");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.files.contentCategory"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.files";
  }



}

export class ComponentVisibilitySearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("componentVisibility");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.files.visibility"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.files";
  }
}

export class DegreeSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("degree");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.degree"];
  }
}

export class EventTitleSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("eventTitle");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.event.title"];
  }
}

export class JournalSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("journal");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.sources.title", "metadata.sources.alternativeTitles.value"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.sources";
  }
}

export class LanguageSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("language");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.languages"];
  }
}

export class LocalTagSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("localTag");
  }

  override getElasticIndexes(): string[] {
    return ["localTags"];
  }
}

export class OrcidSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("orcid");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.creators.person.orcid", "metadata.sources.creators.person.orcid"];
  }
}

export class ProjectInfoSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("projectInfo");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.projectInfo.title", "metadata.projectInfo.grantIdentifier.id", "metadata.projectInfo.fundingInfo.fundingProgram.title", "metadata.projectInfo.fundingInfo.fundingProgram.identifiers.id", "metadata.projectInfo.fundingInfo.fundingOrganization.title", "metadata.projectInfo.fundingInfo.fundingOrganization.identifiers.id"];
  }
}

export class SourceSearchCriterion extends StandardSearchCriterion {

  constructor() {
    super("source");
  }

  override getElasticIndexes(): string[] {
    return ["metadata.sources.title", "metadata.sources.alternativeTitles.value"];
  }

  override getElasticSearchNestedPath(): string | undefined {
    return "metadata.sources";
  }

}


