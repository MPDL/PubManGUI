import { Pipe, type PipeTransform } from '@angular/core';

import * as resp from 'src/app/components/batch/interfaces/actions-responses';
import { BatchProcessLogDetailState } from 'src/app/model/inge';

@Pipe({
  name: 'stateFilter',
  standalone: true,
  pure: false
})
export class StateFilterPipe implements PipeTransform {

  transform(value: any, filterValues: BatchProcessLogDetailState[], propName: string): any {
    console.log(`\n--- on mi pipe: \n ${value.length} \n ${filterValues.length} \n ${propName}`);
    if (value.length === 0 || filterValues.length === 0) {
      return value;
    }
    const resultArray = [];
    for (const item of value) {
      for (const filterValue of filterValues) {
        console.log(item.item.state + ' - ' + filterValue + ' = ' + (item.item.state === filterValue))
        console.log(item.item[propName]);
        if (item.item.state === filterValue) {
          resultArray.push(item);
          break;
        }
      }
    }
    console.log(`\n--- ${resultArray.length} ---\n`);
    return resultArray;
  }

}
