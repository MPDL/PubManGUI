import { Pipe, PipeTransform } from '@angular/core';
import { KeyValuePipe } from "@angular/common";

const keepOrder = (a: any, b: any) => a;

@Pipe({
  name: 'defaultKeyValue',
  standalone: true
})
export class DefaultKeyValuePipe extends KeyValuePipe implements PipeTransform {


  override transform(value: any, ...args: any[]): any {
    return super.transform(value, keepOrder);
  }

}
