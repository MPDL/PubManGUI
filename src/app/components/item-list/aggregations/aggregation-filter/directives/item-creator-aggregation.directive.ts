import { Directive } from '@angular/core';
import {ItemAggregationBaseDirective} from "./item-aggregation-base.directive";
import {AggregationResultView} from "../item-aggregation-filter.component";
import {baseElasticSearchQueryBuilder} from "../../../../../shared/services/search-utils";

@Directive({
  selector: '[pureItemCreatorAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemCreatorAggregationDirective
  }],
  standalone: true
})
export class ItemCreatorAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "metadata.creators.person.identifier.id"},
        aggs: {
          otherFields: {
            top_hits: {
              _source: {
                includes: ["metadata.creators.person.givenName", "metadata.creators.person.familyName", "metadata.creators.person.identifier.id"]
              },
              size: 1
            }
          }
        }
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "creatorsAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const displayValCreator = b['top_hits#otherFields'].hits.hits[0]._source.metadata.creators.find((creator:any) => {
        return creator.person && creator.person.identifier && creator.person.identifier.id === b.key}
      );
      const aggResult: AggregationResultView = {
        displayValue: displayValCreator.person.familyName + ", " + displayValCreator.person.givenName,//b['top_hits#otherFields'].hits.hits[0]._source.context.name,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('metadata.creators.person.identifier.id', selectedValues.map(arv => arv.selectionValue));
  }



}
