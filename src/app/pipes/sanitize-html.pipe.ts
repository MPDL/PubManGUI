import { Pipe, PipeTransform } from '@angular/core';
import sanitizeHtml from 'sanitize-html'

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {

  transform(value: string | undefined, allowedTags?: string[]): unknown {
    if(value) {
      return sanitizeHtml(value, {
        allowedTags: allowedTags ? allowedTags : ['sub', 'sup','b','i']
      });
    }
    return value;

  }

}
