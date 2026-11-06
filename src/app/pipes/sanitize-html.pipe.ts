import { Pipe, PipeTransform } from '@angular/core';
import { sanitizeHtml } from '../utils/html-sanitizer';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {

  transform(value: string | undefined, allowedTags?: string[]): string | undefined {
    if (value) {
      return sanitizeHtml(value, {
        allowedTags: allowedTags ?? ['sub', 'sup', 'b', 'i'],
      });
    }
    return value;
  }

}
