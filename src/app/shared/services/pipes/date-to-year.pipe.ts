import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateToYear',
  standalone: true
})
export class DateToYearPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (value && value.length >=4) {
      return value.substring(0,3);
    }
    return value;
  }

}
