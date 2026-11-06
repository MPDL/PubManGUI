import { Pipe, PipeTransform } from '@angular/core';
import { sanitizeHtml } from '../utils/html-sanitizer';

@Pipe({
  name: 'sanitizeHtmlCitation',
  standalone: true
})
export class SanitizeHtmlCitationPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): string | undefined {
    if (value) {
      return sanitizeHtml(value, {
        allowedTags: ['sub', 'sup', 'span', 'b', 'i', 'localized'],
        allowedClasses: { span: ['Italic', 'DisplayDateStatus'] },
      });
    }
    return value;
  }

}
