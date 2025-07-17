import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import { ItemVersionState } from "../../../../../model/inge";

@Directive({
  selector: '[pureItemStatusAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemStatusAggregationDirective
  }],
  standalone: true
})
export class ItemStatusAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "mergedStatus"},
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "statusAgg";
  }

  override getRuntimeMapping(): any {
    return {
      mergedStatus: {
        type: "keyword",
        script: `
          String publicStatus = doc['publicState'].value;
          if(publicStatus.equals('WITHDRAWN')) {
            emit(publicStatus);
          }
          else {
            emit(doc['versionState'].value);
          }
        `
      }
    }
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
    let query = undefined;
    if (selectedValues[0].selectionValue === ItemVersionState.WITHDRAWN.valueOf()) {
      query =
        {
          bool: {
            must: [
              {term: {publicState: ItemVersionState.WITHDRAWN.valueOf()}}
            ]
          }
        }
    } else {
      const states = selectedValues[0].selectionValue ? [selectedValues[0].selectionValue] : [ItemVersionState.PENDING.valueOf(), ItemVersionState.SUBMITTED.valueOf(), ItemVersionState.IN_REVISION, ItemVersionState.RELEASED];
      query =
        {
          bool: {
            must: [{
              terms: {
                versionState: states
              }
            }
            ],
            must_not: [
              {term: {publicState: ItemVersionState.WITHDRAWN.valueOf()}}
            ]
          }
        }




    }
    return query;
  }



}
