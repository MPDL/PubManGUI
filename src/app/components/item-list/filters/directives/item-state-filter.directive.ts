import { Directive } from '@angular/core';
import {ItemFilterDirective} from "./item-filter.directive";
import {ItemVersionState} from "../../../../model/inge";
import {FilterEvent} from "../../item-list.component";



@Directive({
  selector: '[pureItemStateFilter]',

    providers: [{
    provide: ItemFilterDirective,
    useExisting: ItemStateFilterDirective
  }],

  standalone: true
})
export class ItemStateFilterDirective extends ItemFilterDirective {
  private options: { [p: string]: string };

  constructor() {
    super();
    this.options =  Object.assign({'': 'All'}, ...Object.keys(ItemVersionState).map(x => ({ [x]: x })));
  }

  getOptions():{[key:string]: string } {
    return this.options;
  }

  getFilterEvent(selectedValue: string|undefined) : FilterEvent {
    let query = undefined;
    if(ItemVersionState.WITHDRAWN === selectedValue) {
      query =
        {
          bool: {
            must: [
              {term: {publicState: ItemVersionState.WITHDRAWN.valueOf()}}
            ]
          }
        }
    }
    else {
      const states = selectedValue ? [selectedValue] : [ItemVersionState.PENDING.valueOf(), ItemVersionState.SUBMITTED.valueOf(), ItemVersionState.IN_REVISION, ItemVersionState.RELEASED];
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

    const fe: FilterEvent = {
      name: "stateFilter",
      query: query
    }
    return fe; // this will pass the $event object to the parent component.
  }
}
