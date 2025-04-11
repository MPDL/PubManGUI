import {Component, Input} from '@angular/core';
import {AggregationEvent, FilterEvent, ItemListComponent} from "../../item-list.component";
import {BehaviorSubject} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ItemAggregationBaseDirective} from "./directives/item-aggregation-base.directive";


let uniqueId = 0;

@Component({
  selector: 'pure-item-aggregation-filter',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './item-aggregation-filter.component.html',
  styleUrl: './item-aggregation-filter.component.scss'
})
export class ItemAggregationFilterComponent {
  @Input() itemList!: ItemListComponent;
  @Input() label!: string;

  result: BehaviorSubject<any | undefined> = new BehaviorSubject<any | undefined>(undefined);
  resultView: Map<string,AggregationResultView> = new Map;

  inputId = `${uniqueId++}`;

  constructor(private aggregationDirective: ItemAggregationBaseDirective) {
  }

  ngOnInit()
  {
    const aggEvent: AggregationEvent = {
      name: this.aggregationDirective.getName(),
      query: this.aggregationDirective.getAggregationQuery(),
      runtimeMapping: this.aggregationDirective.getRuntimeMapping(),
      result: this.result
    }

    this.itemList.registerAggregation(aggEvent)
    this.result.subscribe(res => {
      //console.log(JSON.stringify(res));

      if(res) {
        const resultViews =  this.aggregationDirective.parseResult(res);
        resultViews.forEach(rv => {
          if(this.resultView.has(rv.selectionValue)) {
            rv.selected = this.resultView.get(rv.selectionValue)?.selected;
          }

        });
        this.resultView.clear();
        resultViews.forEach(rv => this.resultView.set(rv.selectionValue, rv));

      }
      else {
        this.resultView.clear();
      }
    })
  }

  ngAfterViewInit(){

  }

  selectValue(val: AggregationResultView) {
    //console.log(val)
    let query = undefined;
    if(val.selected)
    {
      val.selected = false;
    }
    else
    {
      val.selected=true;

    }
    const selectedResultViews=[...this.resultView.values()].filter(rv => rv.selected);
    if(selectedResultViews && selectedResultViews.length)
      query = this.aggregationDirective.getFilterQuery(selectedResultViews);
    //console.log("aggQuery: " + JSON.stringify(query))
    const fe: FilterEvent = {
      name: this.aggregationDirective.getName(),
      query: query
    }
    this.itemList.updateFilter(fe)



  }
}

export interface AggregationResultView {
  displayValue: string,
  docCount: number,
  selectionValue: string,
  selected?: boolean
}
