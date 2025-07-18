import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslateModule, TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'pure-lang-switch',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './lang-switch.component.html'
})
export class LangSwitchComponent {

  translateSvc = inject(TranslateService);

  switchLang(lang: string) {
      this.translateSvc.use(lang);
  }

  public get currentLang(): string {
    return this.translateSvc.currentLang;
   }

}
