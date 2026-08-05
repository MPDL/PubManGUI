import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";
import {ItemVersionState, Storage} from "../../../../../model/inge";
import {baseElasticSearchQueryBuilder} from "src/app/utils/search-utils";

@Directive({
  selector: '[pureFileVisibilityAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: FileVisibilityAggregationDirective
  }],
  standalone: true
})
export class FileVisibilityAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        nested: {
          path: "files"
        },
        aggs : {
          "internalFiles": {
            filter: {term: {"files.storage": Storage.INTERNAL_MANAGED}},
            aggs: {
              visibilityAgg: {
                terms: {"field": "files.visibility"},
                aggs: {
                  parent_docs: {
                    reverse_nested: {}
                  }
                }
              },

            }

          }
        }
      }
    }
    return aggQuery;
  }

  getName(): string {
    return "fileVisibilityAgg";
  }


  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    console.log("aggResult", aggResult);
    aggResult['filter#internalFiles']['sterms#visibilityAgg'].buckets.forEach((b: any) => {
      const aggResult: AggregationResultView = {
        displayValue: 'Visibility.' +b.key,
        translateDisplayValue: true,
        selectionValue: b.key,
        docCount: b['reverse_nested#parent_docs'].doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {

    const filterQuery =
    {
      nested : {
        path : "files",
        query : {
          bool : {
            must : [
              { term : { "files.storage": Storage.INTERNAL_MANAGED}},
              { terms : { "files.visibility": selectedValues.map(arv => arv.selectionValue)}}
            ]
          }
        }
      }
    }
    return filterQuery;
  }



}
