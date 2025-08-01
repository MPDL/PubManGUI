import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterEvent, ItemListComponent } from "../../item-list.component";
import { ItemFilterDirective } from "../directives/item-filter.directive";
import { DefaultKeyValuePipe } from "../../../../pipes/default-key-value.pipe";
import { TranslatePipe } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'pure-item-filter',
  standalone: true,
  imports: [
    DefaultKeyValuePipe,
    TranslatePipe,
    FormsModule
  ],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.scss'
})
export class ItemFilterComponent {
  @Input() itemList!: ItemListComponent;
  @Input() label!: string;
  //@Output() filterChanged = new EventEmitter<FilterEvent>();
  selectedValue:string = "";
  selectedFilterEvent:FilterEvent;
  //options!: {[key:string]: string } ;


  constructor(protected filterDirective: ItemFilterDirective) {
    this.selectedFilterEvent = this.filterDirective.getFilterEvent("");
  }

  handleInputChange($event: any){
    const targetVal = $event.target.value;
    this.selectedFilterEvent = this.filterDirective.getFilterEvent(targetVal);
    //this.filterChanged.emit(this.filterDirective.getFilterEvent(targetVal));
    this.itemList.updateFilterOrSort();
    //this.itemList.updateFilter(this.filterDirective.getFilterEvent(targetVal));
  }

  get options() {
    return this.filterDirective.getOptions();
  }

  reset() {
    this.selectedFilterEvent = this.filterDirective.getFilterEvent("");
  }

  /*
  getFilterEvent(val: any) {
    return this.filterDirective.getFilterEvent(val);
  }

   */


}
