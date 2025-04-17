import { Pipe, type PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizeDate',
  pure: false
})
export class LocalizeDatePipe implements PipeTransform {

  constructor(private translateService: TranslateService) { }

  transform(value: Date, format = 'mediumDate'): string {
    const datePipe = new DatePipe(this.translateService.currentLang);
    return datePipe.transform(value, format) || Date.toString();
  }

}

