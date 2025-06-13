import {Directive, Input} from '@angular/core';
import {ItemFilterDirective} from "./item-filter.directive";
import {AaService} from "../../../../services/aa.service";
import {FilterEvent} from "../../item-list.component";
import {baseElasticSearchQueryBuilder} from "../../../../shared/services/search-utils";
import {ImportService} from "../../../../services/pubman-rest-client/import.service";
import {ImportLogDbVO} from "../../../../model/inge";
import {Observable} from "rxjs";
import {DatePipe} from "@angular/common";
import { LOCALE_ID, Inject } from '@angular/core';


@Directive({
  selector: '[pureItemImportFilter]',
  providers: [{
    provide: ItemFilterDirective,
    useExisting: ItemImportFilterDirective
  }],
  standalone: true
})
export class ItemImportFilterDirective extends ItemFilterDirective {
  private options!: { [p: string]: string };

  @Input() type!: 'my' | 'moderator'

  constructor(private aa: AaService, private importService: ImportService, @Inject(LOCALE_ID) private locale: string) {
    super();
    //this.options = Object.assign({'': 'All'}, ...Object.keys(ItemVersionState).map(x => ({ [x]: x })));
  }

  ngOnInit() {
    const datePipe= new DatePipe(this.locale);
    let importLogs$ = undefined;
    if(this.type==='moderator') {
      importLogs$ = this.importService.getImportLogsForModerator();
    }
    else {
      importLogs$ = this.importService.getImportLogs();
    }
    importLogs$.subscribe(importLogs => {

      this.options =  Object.assign({'': 'common.all'}, ...importLogs.map(importLog => ({ [importLog.name]: importLog.name +' (' + datePipe.transform(importLog.startDate, 'short') + ')' })));
    });
  }

  getOptions():{[key:string]: string } {
    return this.options;
  }

  getFilterEvent(selectedValue: string|undefined) : FilterEvent {
    let query = undefined;

    if(selectedValue)
      query = baseElasticSearchQueryBuilder('localTags', '"'+selectedValue+'"');
    else
      query= undefined;

    const fe: FilterEvent = {
      name: "importFilter",
      query: query
    }
    return fe;
  }
}
