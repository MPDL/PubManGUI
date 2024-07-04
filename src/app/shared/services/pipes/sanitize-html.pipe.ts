import { Pipe, PipeTransform } from '@angular/core';
import sanitizeHtml from 'sanitize-html'

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if(value) {
      return sanitizeHtml(value, {
        allowedTags: ['sub', 'sup']
      });
    }
    return value;

  }

}
