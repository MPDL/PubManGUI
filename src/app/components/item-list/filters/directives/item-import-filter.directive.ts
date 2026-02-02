import { Directive, Inject, Input, LOCALE_ID } from '@angular/core';
import { ItemFilterDirective } from "./item-filter.directive";
import { AaService } from "../../../../services/aa.service";
import { FilterEvent } from "../../item-list.component";
import { baseElasticSearchQueryBuilder } from "../../../../utils/search-utils";
import { ImportService } from "../../../../services/pubman-rest-client/import.service";
import { DatePipe } from "@angular/common";
import {map, tap} from "rxjs";


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
    importLogs$.pipe(
      //sort by date descending
      map(importLogs => {
        return importLogs.sort((a,b) => {
          console.log(typeof b.startDate);
          if(a.startDate===undefined || b.startDate===undefined)
            return 0;
          else
            return (new Date(b.startDate)).valueOf() - (new Date(a.startDate)).valueOf()
        })
      }),
      tap(importLogs => {
        this.options =  Object.assign({'': 'common.all'}, ...importLogs.map(importLog => ({ [importLog.name]: importLog.name +' (' + datePipe.transform(importLog.startDate, 'short') + ')' })));
      })
    )

      .subscribe();
  }

  getOptions():{[key:string]: string } {
    return this.options;
  }

  getFilterEvent(selectedValue: string|undefined) : FilterEvent {
    let query = undefined;

    if(selectedValue)
      query = baseElasticSearchQueryBuilder({index: 'localTags', type: "text"}, '"'+selectedValue+'"');
    else
      query= undefined;

    const fe: FilterEvent = {
      name: "importFilter",
      query: query
    }
    return fe;
  }
}
