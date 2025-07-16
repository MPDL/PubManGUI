import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../shared/services/search-utils";

@Directive({
  selector: '[pureItemContextAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemContextAggregationDirective
  }],
  standalone: true
})
export class ItemContextAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "context.objectId"},
        aggs: {
          otherFields: {
            top_hits: {
              _source: {
                includes: ["context.name"]
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
    return "contextsAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: b['top_hits#otherFields'].hits.hits[0]._source.context.name,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('context.objectId', selectedValues.map(arv => arv.selectionValue));

  }



}
