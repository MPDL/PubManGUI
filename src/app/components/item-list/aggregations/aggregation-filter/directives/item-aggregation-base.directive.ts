import { AggregationResultView } from "../item-aggregation-filter.component";


export abstract class ItemAggregationBaseDirective {

  constructor() { }


  abstract getAggregationQuery(): any;
  abstract parseResult(aggResult: any): AggregationResultView[];
  abstract getFilterQuery(selectedValues: AggregationResultView[]): any;
  abstract getName(): string;
  getRuntimeMapping() :any {
    return undefined;
  }

}
