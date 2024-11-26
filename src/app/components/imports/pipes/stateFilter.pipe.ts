import { Pipe, type PipeTransform } from '@angular/core';

import { ImportErrorLevel } from 'src/app/model/inge';

@Pipe({
  name: 'stateFilter',
  standalone: true,
  pure: false
})
export class StateFilterPipe implements PipeTransform {

  transform(value: any, filterValues: ImportErrorLevel[], propName: string): any {
    if (value.length === 0 || filterValues.length === 0) {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      for (const filterValue of filterValues) {
        if (item.errorLevel === filterValue) {
          resultArray.push(item);
          break;
        }
      }
    }
    return resultArray;
  }

}
