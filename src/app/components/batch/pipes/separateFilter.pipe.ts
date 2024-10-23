import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'separate',
  standalone: true,
  pure: false
})
export class SeparateFilterPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/-/g, ' ').replace(/_/g, ' ');
  }

}
