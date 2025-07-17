import { Directive } from '@angular/core';
import { ItemAggregationBaseDirective } from "./item-aggregation-base.directive";
import { AggregationResultView } from "../item-aggregation-filter.component";

@Directive({
  selector: '[pureItemOuAggregation]',
  providers: [{
    provide: ItemAggregationBaseDirective,
    useExisting: ItemOuAggregationDirective
  }],
  standalone: true
})
export class ItemOuAggregationDirective extends ItemAggregationBaseDirective{

  constructor() {
    super();
  }

  getAggregationQuery(): any {
    const aggQuery= {
      [this.getName()]: {
        terms: {"field": "metadata.creators.person.organizations.identifier"},
        aggs: {
          otherFields: {
            top_hits: {
              _source: {
                includes: ["metadata.creators.person.organizations.name", "metadata.creators.person.organizations.identifier"]
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
    return "ouAgg";
  }

  parseResult(aggResult: any): AggregationResultView[] {
    const resultViews: AggregationResultView[] = [];
    aggResult.buckets.forEach((b: any) => {
      const displayVal = b['top_hits#otherFields'].hits.hits[0]._source.metadata.creators.map((creator: any) => creator.person.organizations)
        .flat().find((ou:any) => ou.identifier === b.key).name;
      const aggResult: AggregationResultView = {
        displayValue: displayVal,//b['top_hits#otherFields'].hits.hits[0]._source.context.name,
        selectionValue: b.key,
        docCount: b.doc_count
      }
      resultViews.push(aggResult);
    })
    return resultViews;
  }

  getFilterQuery(selectedValues: AggregationResultView[]): any {
  }



}
