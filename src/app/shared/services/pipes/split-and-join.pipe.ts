import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitAndOrJoin',
    standalone: true
})
export class SplitAndOrJoinPipe implements PipeTransform {

  transform(value: string | string[], ...args: string[]): string {
    if (typeof value === 'string') {
      return value.split(args[0]).join(args[1]);
    }
    return value.join(args[1]);
  }

}
