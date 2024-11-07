import {Component, ContentChildren, Input, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {ItemListElementComponent} from "../../../item-list/item-list-element/item-list-element.component";

@Component({
  selector: 'pure-item-view-metadata-element',
  standalone: true,
  imports: [],
  templateUrl: './item-view-metadata-element.component.html',
  styleUrl: './item-view-metadata-element.component.scss',
})
export class ItemViewMetadataElementComponent {
  @ContentChildren(ItemViewMetadataElementComponent, {descendants:true}) subItems!: QueryList<ItemViewMetadataElementComponent>;

  @Input() sub: boolean = false;

  @Input() condition: boolean = true;

  last: boolean = false;


  ngAfterViewInit(){
    /*
    console.log(this.subItems.length)
    if(this.subItems.length) {
      const lastElement: ItemViewMetadataElementComponent = this.subItems.last;
      if(lastElement.sub) {
        console.log(lastElement)
        lastElement.last = true;
      }

    }
*/
    //this.subItems.map(i => console.log('Sub: ' + i.sub));
  }

}
