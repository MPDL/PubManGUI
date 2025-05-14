import { Pipe, PipeTransform } from '@angular/core';
import {KeyValuePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

const keepOrder = (a: any, b: any) => a;

@Pipe({
  name: 'sortByLabel',
  standalone: true
})
export class SortByLabelPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  transform(value: string[] | undefined, ...args: any[]): any {
    let prefix = "";
    if(args && args.length > 0) {
      prefix = args[0]
    }
    if(value) {
      const translatedMap = value.map(val => {
        return {"key" : val, "value" : this.translateService.instant(prefix + val)};
      })
      //sort by translation
      translatedMap.sort((a,b) => a.value.localeCompare(b.value));

      //return keys
      return translatedMap.map(o => o.key);
    }

    return value;
  }

}
