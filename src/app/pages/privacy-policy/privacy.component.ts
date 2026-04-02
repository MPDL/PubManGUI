import {ChangeDetectionStrategy, Component, inject, ViewContainerRef} from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatomoOptOutDirective} from "./matomo-opt-out.directive";

@Component({
  selector: 'en-content',
  imports: [
    FormsModule,
    MatomoOptOutDirective,
    ReactiveFormsModule
  ],
  templateUrl: './en/privacy.en.component.html'
})
export class en {
}

@Component({
  selector: 'de-content',
  imports: [
    MatomoOptOutDirective,
    FormsModule
  ],
  templateUrl: './de/privacy.de.component.html'
})
export class de {


}

@Component({
  selector: 'pure-privacy',
  imports: [],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyComponent {
  translateSvc = inject(TranslateService);

  private viewContainer = inject(ViewContainerRef);


  ngOnInit() {
    this.loadContent(this.translateSvc.currentLang);
    this.translateSvc.onLangChange.subscribe((event: LangChangeEvent) => {
      console.log(event.lang);
      this.loadContent(this.translateSvc.currentLang);
    });
  }

  loadContent(lang: string) {
    this.viewContainer.clear();
    switch (lang) {
      case 'de':
        this.viewContainer.createComponent(de);
        break;
      default:
        this.viewContainer.createComponent(en);
    }
  }
}
