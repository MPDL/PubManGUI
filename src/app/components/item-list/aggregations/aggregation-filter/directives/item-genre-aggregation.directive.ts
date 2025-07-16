import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { baseElasticSearchQueryBuilder } from "../../../../../shared/services/search-utils";

@Directive({
  selector: '[pureItemGenreAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemGenreAggregationDirective
  }],
  standalone: true
})
export class ItemGenreAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "metadata.genre"},
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "genresAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: 'MdsPublicationGenre.' +b.key, //['top_hits#otherFields'].hits.hits[0]._source.context.name,
        translateDisplayValue: true,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    return baseElasticSearchQueryBuilder('metadata.genre', selectedValues.map(arv => arv.selectionValue));

  }



}
