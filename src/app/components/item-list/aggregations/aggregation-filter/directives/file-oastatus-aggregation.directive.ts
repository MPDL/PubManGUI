import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../utils/search-utils";

@Directive({
  selector: '[pureFileOaStatusAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: FileOaStatusAggregationDirective
  }],
  standalone: true
})
export class FileOaStatusAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "files.metadata.oaStatus.keyword_default"}
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "fileOaStatusAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: 'OAStatus.' +b.key,
        translateDisplayValue: true,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder({index : 'files.metadata.oaStatus.keyword_default', type:"keyword"}, selectedValues.map(arv => arv.selectionValue));

  }



}
