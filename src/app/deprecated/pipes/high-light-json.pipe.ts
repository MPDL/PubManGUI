import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'highLightJson',
    standalone: true
})
export class HighLightJsonPipe implements PipeTransform {

  transform(json: string, args: string): string {
    const regex = new RegExp(args, 'gi');
    return args ? json.replace(regex, (match) => `<span class="highlight">${match}</span>`) : json;
  }
}
