import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreatorRole, ItemVersionState} from "../../../../model/inge";
import {FilterEvent} from "../../../item-list/item-list.component";

@Component({
  selector: 'pure-item-state-filter',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './item-state-filter.component.html',
  styleUrl: './item-state-filter.component.scss'
})
export class ItemStateFilterComponent {

  @Output() filterChanged = new EventEmitter<FilterEvent>();
  itemStateOptions = Object.keys(ItemVersionState);

  ngAfterViewInit(){
    this.fireEventForFilterChange("")
  }

  handleInputChange($event: any){
    const targetVal = $event.target.value;
    this.fireEventForFilterChange(targetVal);

  }

  fireEventForFilterChange(state:string) {
    let query = undefined;
    if(ItemVersionState.WITHDRAWN === state) {
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
      const states = state ? [state] : [ItemVersionState.PENDING.valueOf(), ItemVersionState.SUBMITTED.valueOf(), ItemVersionState.IN_REVISION, ItemVersionState.RELEASED];
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
    this.filterChanged.emit(fe); // this will pass the $event object to the parent component.
  }

}
