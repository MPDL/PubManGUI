import { Component, Input } from '@angular/core';
import { ItemListComponent } from "../../item-list.component";
import { ItemFilterDirective } from "../directives/item-filter.directive";
import { DefaultKeyValuePipe } from "../../../../shared/services/pipes/default-key-value.pipe";
import { TranslatePipe } from "@ngx-translate/core";


@Component({
  selector: 'pure-item-filter',
  standalone: true,
  imports: [
    DefaultKeyValuePipe,
    TranslatePipe
  ],
  templateUrl: './item-filter.component.html',
  styleUrl: './item-filter.component.scss'
})
export class ItemFilterComponent {
  @Input() itemList!: ItemListComponent;
  @Input() label!: string;
  //options!: {[key:string]: string } ;


  constructor(private filterDirective: ItemFilterDirective) {
    //this.options = this.filterDirective.getOptions();
  }

  ngAfterViewInit(){
    this.itemList.registerFilter(this.filterDirective.getFilterEvent(""))
  }

  handleInputChange($event: any){
    const targetVal = $event.target.value;
    this.itemList.updateFilter(this.filterDirective.getFilterEvent(targetVal));
  }

  get options() {
    return this.filterDirective.getOptions();
  }


}
