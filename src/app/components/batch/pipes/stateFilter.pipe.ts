import {Pipe, type PipeTransform} from '@angular/core';

import {BatchProcessLogDetailState} from '../interfaces/batch-responses';

@Pipe({
  name: 'stateFilter',
  standalone: true,
  pure: false
})
export class StateFilterPipe implements PipeTransform {

  transform(value: any, filterValues: BatchProcessLogDetailState[], propName: string): any {
    if (value.length === 0 || filterValues.length === 0) {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      for (const filterValue of filterValues) {
        if (item.item.state === filterValue) {
          resultArray.push(item);
          break;
        }
      }
    }
    return resultArray;
  }

}
