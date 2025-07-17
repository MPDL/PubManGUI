import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../shared/services/search-utils";

@Directive({
  selector: '[pureItemLocalTagAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemLocalTagAggregationDirective
  }],
  standalone: true
})
export class ItemLocalTagAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "localTags.keyword_default"}
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "localTagsAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: b.key, //b['top_hits#otherFields'].hits.hits[0]._source.localTags,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('localTags.keyword', selectedValues.map(arv => arv.selectionValue));

  }



}
