import { Component, ContentChildren, Input, QueryList } from '@angular/core';

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

  @Input() highlight: boolean = true;

  @Input() hl:boolean = false;

  last: boolean = false;

  ngOnInit(): void {
    if(!this.sub) {
      this.hl=true;
    }
  }

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
