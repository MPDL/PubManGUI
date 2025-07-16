import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";

@Directive({
  selector: '[pureItemDateAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemDateAggregationDirective
  }],
  standalone: true
})
export class ItemDateAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        date_histogram: {
          field: "metadata.anyDates",
          calendar_interval: "1Y",
          format: "yyyy",
          min_doc_count: 1,
          order: { _key: "desc" }
        },
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "dateAgg";
  }


  override getRuntimeMapping(): any {
    return undefined;

  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: b.key_as_string,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
    let query = {
      bool: {
        should: selectedValues.map(arv => {
          return {
            range: {
              "metadata.anyDates" : {
                gte: arv.displayValue,
                lte: arv.displayValue,
                format: 'yyyy'
              }
            }
          }
        })
      }

    }
      return query;


  }



}
