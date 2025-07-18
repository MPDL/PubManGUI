import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../utils/search-utils";

@Directive({
  selector: '[pureItemSourceTitleAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemSourceTitleAggregationDirective
  }],
  standalone: true
})
export class ItemSourceTitleAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "metadata.sources.title.keyword_default"},
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "sourceTitleAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: b.key,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('metadata.sources.title.keyword_default', selectedValues.map(arv => arv.selectionValue));

  }



}
