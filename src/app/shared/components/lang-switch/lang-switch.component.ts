import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  selector: 'pure-lang-switch',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss'
})
export class LangSwitchComponent {

  svc = inject(I18nService);

  switch_lang() {
    const loc = this.svc.locale();
    if (loc?.localeCompare('de') === 0) {
      localStorage.setItem('locale', 'en');
      this.svc.setLocale()
    } else {
      localStorage.setItem('locale', 'de');
    }
    location.reload();
  }
}
