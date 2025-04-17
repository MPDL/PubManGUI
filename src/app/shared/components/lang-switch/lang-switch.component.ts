import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { I18nService } from 'src/app/shared/services/i18n.service';

import { TranslateModule } from "@ngx-translate/core";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-lang-switch',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './lang-switch.component.html'
})
export class LangSwitchComponent {

  svc = inject(I18nService);
  translate = inject(TranslateService);

  switch_lang() {
    const loc = this.svc.locale();
    if (loc?.localeCompare('de') === 0) {
      localStorage.setItem('locale', 'en');
      this.svc.setLocale();
      this.translate.use('en');
    } else {
      localStorage.setItem('locale', 'de');
      this.svc.setLocale();
      this.translate.use('de');
    }
    //console.log(this.svc.locale());
    //location.reload();
  }

}
