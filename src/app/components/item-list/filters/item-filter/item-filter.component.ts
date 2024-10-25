import {Component, ContentChild, Input} from '@angular/core';
import {FilterEvent, ItemListComponent} from "../../item-list.component";
import {fieldOptions} from "../../../../model/pure_search";
import {KeyValuePipe} from "@angular/common";
import {ItemFilterDirective} from "../directives/item-filter.directive";


@Component({
  selector: 'pure-item-filter',
  standalone: true,
  imports: [
    KeyValuePipe
  ],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.scss'
})
export class ItemFilterComponent {
  @Input() itemList!: ItemListComponent;
  @Input() label!: string;
  options!: {[key:string]: string } ;


  constructor(private filterDirective: ItemFilterDirective) {
    this.options = this.filterDirective.getOptions();
  }

  ngAfterViewInit(){
    this.itemList.registerFilter(this.filterDirective.getFilterEvent(""))
  }

  handleInputChange($event: any){
    const targetVal = $event.target.value;
    this.itemList.updateFilter(this.filterDirective.getFilterEvent(targetVal));
  }


}
