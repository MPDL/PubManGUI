import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'empty',
  standalone: true
})
export class EmptyPipe implements PipeTransform {

  transform<T>(value: T | undefined | null): boolean {
    if (value === undefined || value === null || value === '') {
      return false;
    }
    if (typeof value === 'number' && isNaN(value)) {
      return false;
    }
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  }

}
