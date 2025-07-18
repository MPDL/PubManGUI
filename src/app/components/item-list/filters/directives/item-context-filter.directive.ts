import { Directive, Input } from '@angular/core';
import { ItemFilterDirective } from "./item-filter.directive";
import { AaService } from "../../../../services/aa.service";
import { FilterEvent } from "../../item-list.component";
import { baseElasticSearchQueryBuilder } from "../../../../utils/search-utils";
import { ContextDbVO } from "../../../../model/inge";


@Directive({
  selector: '[pureItemContextFilter]',
  providers: [{
    provide: ItemFilterDirective,
    useExisting: ItemContextFilterDirective
  }],
  standalone: true
})
export class ItemContextFilterDirective extends ItemFilterDirective {
  private options!: { [p: string]: string };

  @Input() type!: 'my' | 'moderator'

  constructor(private aa: AaService) {
    super();
    //this.options = Object.assign({'': 'All'}, ...Object.keys(ItemVersionState).map(x => ({ [x]: x })));
  }

  ngOnInit() {

    this.aa.principal.subscribe(p => {
      let contextList: ContextDbVO[] = [];
      if(this.type==='moderator') {
        contextList = p.moderatorContexts;
      }
      else {
        contextList = p.depositorContexts;
      }
      this.options =  Object.assign({'': 'common.all'}, ...contextList.map(context => ({ [context.objectId]: context.name })));
    })
  }

  getOptions():{[key:string]: string } {
    return this.options;
  }

  getFilterEvent(selectedValue: string|undefined) : FilterEvent {
    let query = undefined;

    if(selectedValue)
      query = baseElasticSearchQueryBuilder('context.objectId', selectedValue);
    else
      query= undefined;
    const fe: FilterEvent = {
      name: "contextFilter",
      query: query
    }
    return fe;
  }
}
