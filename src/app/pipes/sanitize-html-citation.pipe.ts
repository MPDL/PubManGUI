import { Pipe, PipeTransform } from '@angular/core';
import sanitizeHtml from 'sanitize-html'

@Pipe({
  name: 'sanitizeHtmlCitation',
  standalone: true
})
export class SanitizeHtmlCitationPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if(value) {
      return sanitizeHtml(value, {
        allowedTags: ['sub', 'sup', 'span', 'b', 'i'],
        allowedClasses: {'span': ['Italic', 'DisplayDateStatus']}
      });
    }
    return value;

  }

}
