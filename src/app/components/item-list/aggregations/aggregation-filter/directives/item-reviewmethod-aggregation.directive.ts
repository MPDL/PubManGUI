import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../shared/services/search-utils";

@Directive({
  selector: '[pureItemReviewMethodAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemReviewMethodDirective
  }],
  standalone: true
})
export class ItemReviewMethodDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "metadata.reviewMethod"},
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
    return "reviewMethodAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: 'ReviewMethod.' +b.key,
        translateDisplayValue: true,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('metadata.reviewMethod', selectedValues.map(arv => arv.selectionValue));

  }



}
